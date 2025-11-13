'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getTeamData, TeamData } from '@/lib/api'

interface Flag {
  level: number
  flag: string
  capturedAt: string
}

export default function TeamDashboard() {
  const params = useParams()
  const teamId = params.teamId as string

  const [loading, setLoading] = useState(true)
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const data = await getTeamData(teamId)
        setTeamData(data)
      } catch (err: unknown) {
        const error = err as { error: string }
        setError(error.error || 'Failed to load team data')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchTeamData()
    }
  }, [teamId])

  if (loading) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold glow-text">TEAM DASHBOARD</h1>
          <div className="text-green-300 text-sm">
            <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
              LOADING...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold glow-text">TEAM DASHBOARD</h1>
          <div className="text-green-300 text-sm">
            <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
              ERROR
            </div>
          </div>
        </div>
        <div className="cyber-card text-red-400 border-red-500/50">
          <div className="text-sm">✗ {error}</div>
        </div>
      </div>
    )
  }

  if (!teamData) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold glow-text">TEAM DASHBOARD</h1>
          <div className="text-green-300 text-sm">
            <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
              TEAM NOT FOUND
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold glow-text">TEAM DASHBOARD</h1>
        <div className="text-green-300 text-sm">
          <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
            TEAM STATUS
          </div>
        </div>
      </div>

      <div className="cyber-card">
        <div className="text-green-400 font-bold text-lg mb-2">
          {teamData.name}
        </div>
        <div className="text-green-300 text-sm mb-4">
          Team ID: {teamData.id} | Cohort: {teamData.cohort.name}
        </div>
        <div className="text-yellow-400 text-sm">
          Current Level: {teamData.currentLevel}
        </div>
      </div>

      <div className="cyber-card">
        <h2 className="text-green-400 font-bold text-lg mb-4">CAPTURED FLAGS</h2>
        {teamData.capturedFlags && teamData.capturedFlags.length > 0 ? (
          <div className="space-y-3">
            {teamData.capturedFlags.map((flag: Flag, index: number) => (
              <div key={index} className="border border-green-500/30 rounded p-3">
                <div className="text-green-300 text-sm mb-1">
                  Level {flag.level}
                </div>
                <div className="text-yellow-400 font-mono text-sm break-all">
                  {flag.flag}
                </div>
                <div className="text-green-500/50 text-xs mt-1">
                  Captured: {new Date(flag.capturedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-500/50 text-sm">
            No flags captured yet
          </div>
        )}
      </div>

      <div className="text-xs text-green-500/50">
        <div>SECURE TEAM DATA ACCESS</div>
      </div>
    </div>
  )
}
