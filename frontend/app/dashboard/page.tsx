'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamId.trim()) {
      setError('Team UID is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Navigate to team-specific dashboard
      router.push(`/dashboard/${teamId.trim()}`)
    } catch (err: unknown) {
      const error = err as { error: string }
      setError(error.error || 'Failed to access team dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold glow-text">TEAM DASHBOARD</h1>
        <div className="text-green-300 text-sm">
          <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
            STATUS MONITOR
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamId" className="block text-sm font-medium text-green-300 mb-2">
            ENTER TEAM UID
          </label>
          <input
            type="text"
            id="teamId"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="cyber-input w-full"
            placeholder="Enter your team UID..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="cyber-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'ACCESSING...' : 'ACCESS TEAM DATA'}
        </button>
      </form>

      {error && (
        <div className="cyber-card text-red-400 border-red-500/50">
          <div className="text-sm">✗ {error}</div>
        </div>
      )}

      <div className="text-xs text-green-500/50">
        <div>SECURE CONNECTION ESTABLISHED</div>
      </div>
    </div>
  )
}
