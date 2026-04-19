// ─── CrowdSense — Gemini AI Integration ──────────────────────────────────────
// Uses Google Gemini 2.0 Flash to power the AI assistant chatbot.
// Falls back to returning null (triggering mock responses) when the API key
// is not configured, ensuring the app works in demo mode without changes.
// ─────────────────────────────────────────────────────────────────────────────
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { logger } from './logger'
import type { CrowdZone, Gate, FoodCounter } from '../types'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined

/** True when a valid Gemini API key is present and the feature is enabled */
export const isGeminiEnabled = !!(API_KEY && API_KEY.trim() && API_KEY !== 'your_gemini_api_key_here')

let genAI: GoogleGenerativeAI | null = null

if (isGeminiEnabled && API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY)
    logger.info('✨ Gemini AI initialized')
  } catch (err) {
    logger.warn('Gemini AI initialization failed — AI chat will use mock responses', err)
  }
}

// ─── Venue context builder for the system prompt ──────────────────────────────
interface VenueContext {
  zones?: CrowdZone[]
  gates?: Gate[]
  counters?: FoodCounter[]
  userTier?: string
  userPoints?: number
  userName?: string
}

function buildSystemPrompt(ctx: VenueContext): string {
  const zonesText = ctx.zones?.map(z =>
    `${z.name}: ${z.level} (${Math.round(z.occupancy / z.capacity * 100)}% full, ${z.waitMinutes}m wait, trend: ${z.trend})`
  ).join('\n  ') ?? 'Not available'

  const gatesText = ctx.gates?.map(g =>
    `${g.name}: ${g.status}, ${g.waitMinutes}m wait`
  ).join('\n  ') ?? 'Not available'

  const userInfo = ctx.userName
    ? `User: ${ctx.userName} | Tier: ${ctx.userTier ?? 'bronze'} | Points: ${ctx.userPoints ?? 0}`
    : 'Guest user'

  return `You are CrowdSense AI, a smart assistant for stadium and venue navigation.
You help fans with crowd levels, food, gate wait times, navigation, and their loyalty points.

Current venue data:
  ZONES:
  ${zonesText}

  GATES:
  ${gatesText}

  ${userInfo}

Rules:
- Be concise and helpful — max 3 sentences unless detail is needed
- Use emoji sparingly but effectively (1-2 per response max)
- Always recommend the least crowded alternatives when relevant
- Format numbers clearly (₹ for prices, minutes for wait times)
- If you don't know, say so briefly and suggest the Map or Food tabs
- Never make up specific prices — direct to the Food tab for ordering`
}

// ─── Safety settings — prevent off-topic harmful content ─────────────────────
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,         threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

// ─── Chat history type ────────────────────────────────────────────────────────
interface GeminiChatTurn {
  role: 'user' | 'model'
  parts: [{ text: string }]
}

// ─── Main API call ─────────────────────────────────────────────────────────────
/**
 * Sends a user message to Gemini AI with full venue context.
 * Returns the AI response string, or `null` if Gemini is unavailable
 * (so the caller can fall back to mock responses).
 *
 * @param userMessage - The message typed by the user
 * @param context     - Current venue state to inject into the system prompt
 * @param history     - Previous conversation turns for context continuity
 */
export async function generateGeminiResponse(
  userMessage: string,
  context: VenueContext,
  history: GeminiChatTurn[] = [],
): Promise<string | null> {
  if (!isGeminiEnabled || !genAI) return null

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: buildSystemPrompt(context),
      safetySettings: SAFETY_SETTINGS,
      generationConfig: {
        maxOutputTokens: 256,
        temperature: 0.7,
        topP: 0.9,
      },
    })

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(userMessage)
    const response = result.response.text()

    logger.debug('Gemini response generated', { chars: response.length })
    return response
  } catch (err) {
    logger.warn('Gemini API call failed — falling back to mock response', err)
    return null
  }
}

export type { VenueContext, GeminiChatTurn }
