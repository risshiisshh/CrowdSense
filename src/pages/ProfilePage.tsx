import React, { useState } from 'react'
import { Settings, Edit2, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import XPBar from '../components/ui/XPBar'
import BadgeGrid from '../components/profile/BadgeGrid'
import PointsHistory from '../components/profile/PointsHistory'
import RewardCard from '../components/profile/RewardCard'
import { useProfile } from '../hooks/useProfile'
import { useAppStore } from '../store/useAppStore'
import { formatPoints } from '../lib/points'

type ProfileTab = 'badges' | 'history' | 'rewards'

const REWARDS = [
  { id: 'r1', name: '10% Off Next Order',   description: 'Enjoy 10% off at any food counter', emoji: '🎁', pointsCost: 500,  isLocked: false, tag: 'Popular' },
  { id: 'r2', name: 'Priority Entry',        description: 'Skip the queue at Gate 1',          emoji: '⚡', pointsCost: 1000, isLocked: false },
  { id: 'r3', name: 'VIP Upgrade',           description: 'One-match VIP lounge access',       emoji: '💎', pointsCost: 3000, isLocked: false, tag: 'Premium' },
  { id: 'r4', name: 'Season Pass Discount',  description: '₹500 off next season pass',          emoji: '🏟️', pointsCost: 5000, isLocked: false },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, badges, pointsHistory } = useProfile()
  const { showToast, setUser, user: storeUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<ProfileTab>('badges')
  const [copied, setCopied] = useState(false)

  // Edit state
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(user?.displayName ?? '')

  function copyReferral() {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode).catch(() => {})
      setCopied(true)
      showToast('Referral code copied! 🎉', 'success')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleRedeem(_id: string) {
    showToast('🎁 Reward redeemed!', 'success')
  }

  function startEdit() {
    setEditName(user?.displayName ?? '')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setEditName(user?.displayName ?? '')
  }

  function saveEdit() {
    if (!storeUser || !editName.trim()) return
    setUser({ ...storeUser, displayName: editName.trim() })
    setEditing(false)
    showToast('Profile updated! ✓', 'success')
  }

  const tierEmoji = user?.tier === 'gold' ? '🥇' : user?.tier === 'silver' ? '🥈' : user?.tier === 'platinum' ? '💎' : '🥉'

  return (
    <PageWrapper>
      {/* Top action buttons */}
      <div className="flex justify-end gap-2 px-4 pt-4">
        {editing ? (
          <>
            <button onClick={cancelEdit}
              className="p-2 rounded-full transition-all hover:scale-110"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}>
              <X size={16} style={{ color: '#FF6B6B' }} />
            </button>
            <button onClick={saveEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:brightness-110 active:scale-95"
              style={{ background: '#10B981', color: '#fff' }}>
              <Check size={13} />
              Save
            </button>
          </>
        ) : (
          <>
            <button onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Edit2 size={12} />
              Edit Profile
            </button>
            <button onClick={() => navigate('/settings')}
              className="p-2 rounded-full transition-all hover:scale-110"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border-subtle)' }}>
              <Settings size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </>
        )}
      </div>

      {/* Profile hero */}
      <div className="px-4 pb-4 flex flex-col items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-300"
            style={{
              borderColor: '#F59E0B',
              background: 'var(--surface-2)',
              boxShadow: editing ? '0 0 20px rgba(245,158,11,0.4)' : '0 0 0px transparent',
            }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-3xl text-amber-400">
                {(editing ? editName : user?.displayName)?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 text-base">{tierEmoji}</span>
          {editing && (
            <div className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              <Edit2 size={16} color="#F59E0B" />
            </div>
          )}
        </div>

        <div className="text-center w-full max-w-xs">
          {editing ? (
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveEdit()}
              autoFocus
              className="font-display text-2xl tracking-wide text-center w-full bg-transparent outline-none border-b-2 pb-1 transition-all"
              style={{ color: 'var(--text-primary)', borderColor: '#F59E0B' }}
              placeholder="Your name"
            />
          ) : (
            <h2 className="font-display text-2xl tracking-wide" style={{ color: 'var(--text-primary)' }}>
              {user?.displayName}
            </h2>
          )}
          <p className="text-xs font-body mt-1" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
          <div className="flex items-center justify-center gap-3 mt-1.5">
            <span className="text-sm font-body font-semibold text-amber-400">
              {formatPoints(user?.points ?? 0)} pts
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border)' }} />
            <span className="text-sm font-body capitalize" style={{ color: 'var(--text-secondary)' }}>
              {user?.tier} tier
            </span>
          </div>
        </div>

        {/* XP Bar */}
        {user && (
          <div className="w-full">
            <XPBar xp={user.xp} tier={user.tier} />
          </div>
        )}

        {/* Referral code */}
        {!editing && (
          <button
            onClick={copyReferral}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all hover-glow"
            style={{
              background: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          >
            <div className="text-left">
              <p className="text-[11px] font-body" style={{ color: 'var(--text-muted)' }}>Referral Code</p>
              <p className="font-display text-lg tracking-widest text-amber-400">{user?.referralCode}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: copied ? '#10B981' : '#F59E0B', color: '#08090D' }}>
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex mx-3 mb-3 surface-card-2 rounded-xl p-1">
        {(['badges', 'history', 'rewards'] as ProfileTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 text-xs font-body font-semibold rounded-lg capitalize transition-all"
            style={activeTab === tab
              ? { background: '#F59E0B', color: '#08090D' }
              : { color: 'var(--text-muted)' }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="px-3 pb-4">
        {activeTab === 'badges'  && <BadgeGrid badges={badges} />}
        {activeTab === 'history' && <PointsHistory entries={pointsHistory} />}
        {activeTab === 'rewards' && (
          <div className="space-y-2">
            {REWARDS.map(r => (
              <RewardCard key={r.id} reward={r} userPoints={user?.points ?? 0} onRedeem={handleRedeem} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
