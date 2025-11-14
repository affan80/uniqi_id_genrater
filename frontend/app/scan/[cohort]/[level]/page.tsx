'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { scanQR, ScanResponse, ApiError } from '@/lib/api'

export default function ScanPage() {
  const params = useParams()
  const cohort = parseInt(params.cohort as string)
  const level = parseInt(params.level as string)

  const [teamId, setTeamId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ScanResponse | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamId.trim()) {
      setError('Team UID is required')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await scanQR(cohort, level, teamId)
      setResult(response)
    } catch (err: any) {
      setError(err.error || 'Scan failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold glow-text">QR CODE SCANNER</h1>
        <div className="text-green-300 text-sm">
          <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
            LEVEL ACCESS TERMINAL
          </div>
        </div>
      </div>

      <div className="cyber-card">
        <div className="text-green-400 font-bold text-lg mb-1">
          Cohort {cohort} - Level {level}
        </div>
        <div className="text-green-300 text-sm">
          QR code successfully scanned
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
          {loading ? 'SCANNING...' : 'SCAN QR CODE'}
        </button>
      </form>

      {result && (
        <div className="cyber-card text-green-400">
          <div className="text-sm">✓ {result.message}</div>
          <div className="text-xs mt-2">Current Level: {result.currentLevel}</div>
          <div className="text-xs mt-2 text-yellow-400">Flag: {result.flag}</div>
        </div>
      )}

      {error && (
        <div className="cyber-card text-red-400 border-red-500/50">
          <div className="text-sm">✗ {error}</div>
        </div>
      )}

      <div className="text-xs text-green-500/50">
        <div>SECURE SCANNING PROTOCOL ACTIVE</div>
      </div>
    </div>
  )
}
