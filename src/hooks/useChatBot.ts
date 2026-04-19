import { useState, useCallback } from 'react'
import { ChatMessage } from '../types'
import { useAppStore } from '../store/useAppStore'
import { MOCK_ZONES, MOCK_GATES, MOCK_FOOD_COUNTERS, MOCK_MENU_ITEMS } from '../data/mockData'

const GREETING = `Hey there! 👋 I'm **CrowdSense AI** — your personal stadium assistant.

I can help you with:
• 🗺️ **Crowd levels** in different zones
• 🍔 **Food & drinks** recommendations
• 🚪 **Gate wait times** and best routes
• 🏆 **Your points** and tier status
• 📍 **Navigation** inside the stadium

What would you like to know?`

const SUGGESTIONS = [
  'How crowded is North Stand?',
  "What's the best food near me?",
  'My points balance',
  'Which gate has shortest wait?',
  'Show me veg food options',
  "What's my tier status?",
]

function generateId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function assistantMsg(content: string): ChatMessage {
  return { id: generateId(), role: 'assistant', content, timestamp: new Date().toISOString() }
}

function userMsg(content: string): ChatMessage {
  return { id: generateId(), role: 'user', content, timestamp: new Date().toISOString() }
}

// ── Smart mock response engine ──────────────────────────────────────────────
function generateResponse(text: string, user: ReturnType<typeof useAppStore.getState>['user']): string {
  const q = text.toLowerCase()

  // ── Crowd / Zone queries ──
  if (q.includes('crowd') || q.includes('zone') || q.includes('stand') || q.includes('section') || q.includes('busy') || q.includes('packed')) {
    const zoneMatch = MOCK_ZONES.find(z =>
      q.includes(z.name.toLowerCase()) || q.includes(z.section.toLowerCase())
    )
    if (zoneMatch) {
      const pct = Math.round((zoneMatch.occupancy / zoneMatch.capacity) * 100)
      const emoji = zoneMatch.level === 'low' ? '🟢' : zoneMatch.level === 'medium' ? '🟡' : zoneMatch.level === 'high' ? '🔴' : '🚨'
      return `${emoji} **${zoneMatch.name}** is currently **${zoneMatch.level === 'low' ? 'comfortable' : zoneMatch.level === 'medium' ? 'moderate' : zoneMatch.level === 'high' ? 'crowded' : 'packed'}** at **${pct}% capacity** (${zoneMatch.occupancy}/${zoneMatch.capacity} people).

Wait time to enter: **~${zoneMatch.waitMinutes} min**
Trend: ${zoneMatch.trend === 'rising' ? '📈 Getting busier' : zoneMatch.trend === 'falling' ? '📉 Clearing up' : '➡️ Stable'}

${zoneMatch.level === 'high' || zoneMatch.level === 'full'
  ? `💡 **Tip**: Try the **${MOCK_ZONES.find(z => z.level === 'low')?.name || 'East Pavilion'}** — it's much emptier right now!`
  : ''}`
    }

    // General crowd overview
    const sorted = [...MOCK_ZONES].sort((a, b) => a.occupancy - b.occupancy)
    const quietest = sorted[0]
    const busiest = sorted[sorted.length - 1]
    const avgPct = Math.round(sorted.reduce((s, z) => s + (z.occupancy / z.capacity) * 100, 0) / sorted.length)

    return `📊 **Stadium Overview** — ${avgPct}% average crowd density

🟢 **Quietest**: ${quietest.name} (${Math.round(quietest.occupancy / quietest.capacity * 100)}%)
🔴 **Busiest**: ${busiest.name} (${Math.round(busiest.occupancy / busiest.capacity * 100)}%)

${MOCK_ZONES.map(z => {
  const pct = Math.round(z.occupancy / z.capacity * 100)
  const bar = z.level === 'low' ? '🟢' : z.level === 'medium' ? '🟡' : '🔴'
  return `${bar} ${z.name}: ${pct}%`
}).join('\n')}

💡 I'd recommend heading to **${quietest.name}** for the best experience!`
  }

  // ── Gate queries ──
  if (q.includes('gate') || q.includes('entry') || q.includes('entrance') || q.includes('exit')) {
    const gateMatch = MOCK_GATES.find(g => q.includes(g.name.toLowerCase()))
    if (gateMatch) {
      const emoji = gateMatch.status === 'open' ? '🟢' : gateMatch.status === 'limited' ? '🟡' : '🔴'
      return `${emoji} **${gateMatch.name}** status: **${gateMatch.status.charAt(0).toUpperCase() + gateMatch.status.slice(1)}**
Wait time: **~${gateMatch.waitMinutes} min**
Crowd level: ${gateMatch.level}

${gateMatch.status === 'closed' ? '❌ This gate is currently closed. Please use a different gate.' : ''}`
    }

    const openGates = MOCK_GATES.filter(g => g.status === 'open')
    const fastest = [...openGates].sort((a, b) => a.waitMinutes - b.waitMinutes)[0]
    return `🚪 **Gate Wait Times**

${MOCK_GATES.map(g => {
  const e = g.status === 'open' ? '🟢' : g.status === 'limited' ? '🟡' : '🔴'
  return `${e} **${g.name}**: ${g.waitMinutes}m wait${g.status === 'closed' ? ' (CLOSED)' : ''}`
}).join('\n')}

✅ **Fastest gate right now**: ${fastest?.name} with only **${fastest?.waitMinutes} min** wait!`
  }

  // ── Food queries ──
  if (q.includes('food') || q.includes('eat') || q.includes('drink') || q.includes('burger') || q.includes('coffee') || q.includes('snack') || q.includes('hungry') || q.includes('veg') || q.includes('menu')) {
    const isVeg = q.includes('veg') || q.includes('vegetarian')
    const items = MOCK_MENU_ITEMS
      .filter(i => i.isAvailable && (!isVeg || i.isVeg))
      .slice(0, 5)

    if (items.length === 0) {
      return "😔 Sorry, I couldn't find any food matching your preference right now. Try checking the **Food** tab directly!"
    }

    const openCounters = MOCK_FOOD_COUNTERS.filter(c => c.isOpen)
    return `${isVeg ? '🥗' : '🍔'} **${isVeg ? 'Veg Options' : 'Popular Items'} Right Now**

${items.map(item => `${item.emoji} **${item.name}** ₹${(item.price / 100).toFixed(0)} ${item.isVeg ? '🌿' : ''}\n   At: ${item.counterName} · ⭐ ${item.rating}/5 · ~${item.preparationTime}m prep`).join('\n\n')}

🏪 **${openCounters.length} counters open** — lowest wait at **${[...openCounters].sort((a,b) => a.waitMinutes - b.waitMinutes)[0]?.name}** (~${[...openCounters].sort((a,b) => a.waitMinutes - b.waitMinutes)[0]?.waitMinutes}m)

👉 Head to the **Food** tab to order straight to your seat!`
  }

  // ── Points / tier queries ──
  if (q.includes('point') || q.includes('tier') || q.includes('reward') || q.includes('badge') || q.includes('level') || q.includes('xp') || q.includes('balance')) {
    if (!user) return "Please sign in to view your points balance!"

    const tierNextMap: Record<string, string> = {
      bronze: 'Silver (1,000 XP)', silver: 'Gold (2,500 XP)',
      gold: 'Platinum (5,000 XP)', platinum: 'Legend (10,000 XP)', legend: 'MAX TIER 👑'
    }
    return `🏆 **Your CrowdSense Status**

👤 **${user.displayName}**
💰 Points: **${user.points.toLocaleString()} pts**
⚡ XP: **${user.xp.toLocaleString()}**
🎖️ Tier: **${user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}** ${user.tier === 'gold' ? '🥇' : user.tier === 'silver' ? '🥈' : user.tier === 'platinum' ? '💎' : user.tier === 'legend' ? '👑' : '🥉'}

📈 Next tier: **${tierNextMap[user.tier]}**

You can redeem your points for:
• 🎁 10% off food orders (500 pts)
• ⚡ Priority gate entry (1,000 pts)
• 💎 VIP lounge access (3,000 pts)

Head to the **Profile** tab to redeem!`
  }

  // ── Navigation / directions ──
  if (q.includes('where') || q.includes('how to get') || q.includes('direction') || q.includes('navigate') || q.includes('find') || q.includes('restroom') || q.includes('toilet') || q.includes('bathroom')) {
    if (q.includes('restroom') || q.includes('toilet') || q.includes('bathroom')) {
      return `🚻 **Nearest Restrooms**

• **South Stand** — Level 1, near Section B (🟢 Low queue)
• **East Pavilion** — Near Gate 3 entrance
• **Main Concourse** — Ground floor, 6 stalls

💡 South Stand restrooms are least crowded right now!`
    }
    if (q.includes('atm') || q.includes('cash')) {
      return `🏧 **ATMs in Stadium**

• Main Gate lobby (SBI)
• South Stand concourse (HDFC)
• VIP entrance (ICICI)

All ATMs are operational.`
    }
    return `🗺️ **Navigation Help**

I can help you find:
• 🚻 Restrooms
• 🍔 Food counters
• 🚪 Gates & exits
• 🏧 ATMs
• 🚑 First aid
• 🅿️ Parking

Just ask me something specific like *"Where's the closest restroom?"* or *"How do I get to Gate 2?"*

For live crowd navigation, check the **Map** tab!`
  }

  // ── Match score ──
  if (q.includes('score') || q.includes('match') || q.includes('cricket') || q.includes('game') || q.includes('result')) {
    return `🏏 **Live Match Update**

**Mumbai Indians** 🆚 **Chennai Kings**

🔴 **MI**: **168** runs
🔵 **CSK**: **142** runs

📍 Wankhede Stadium · **League Stage**
👥 32,480 fans attending

Mumbai Indians are leading by 26 runs!`
  }

  // ── Greeting ──
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('help')) {
    return GREETING
  }

  // ── Default fallback ──
  return `I'm not sure about that, but here's what I can help with:

🗺️ "How crowded is North Stand?"
🍔 "Show me veg food options"
🚪 "Which gate has shortest wait?"
🏆 "What's my points balance?"
📍 "Where are the restrooms?"
🏏 "What's the current score?"

Try one of the suggestions above!`
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useChatBot() {
  const user = useAppStore(s => s.user)
  const [messages, setMessages] = useState<ChatMessage[]>([
    assistantMsg(GREETING)
  ])
  const [isTyping, setIsTyping] = useState(false)
  const suggestions = SUGGESTIONS

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return

    // Add user message
    const newUserMsg = userMsg(text)
    setMessages(prev => [...prev, newUserMsg])
    setIsTyping(true)

    // Simulate typing delay (0.8–1.5s based on response length)
    const response = generateResponse(text, user)
    const delay = 800 + Math.min(response.length * 2, 700)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, assistantMsg(response)])
    }, delay)
  }, [user])

  const clearChat = useCallback(() => {
    setMessages([assistantMsg(GREETING)])
  }, [])

  return { messages, isTyping, suggestions, sendMessage, clearChat }
}
