'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getCohortLeaderboard, CohortTeamsData } from '@/lib/api'

export default function CohortLeaderboardPage() {
  const params = useParams()
  const cohortId = parseInt(params.cohort as string)
  const level = parseInt(params.level as string)

  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<CohortTeamsData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getCohortLeaderboard(cohortId)
        setLeaderboardData(data)
      } catch (err: unknown) {
        const error = err as { error: string }
        setError(error.error || 'Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    if (cohortId) {
      fetchLeaderboard()
    }
  }, [cohortId])

  if (loading) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold glow-text">COHORT LEADERBOARD</h1>
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
          <h1 className="text-3xl font-bold glow-text">COHORT LEADERBOARD</h1>
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

  if (!leaderboardData || !leaderboardData.cohort) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold glow-text">COHORT LEADERBOARD</h1>
          <div className="text-green-300 text-sm">
            <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
              COHORT NOT FOUND
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold glow-text">COHORT LEADERBOARD</h1>
        <div className="text-green-300 text-sm">
          <div className="inline-block border border-green-500 px-2 py-1 rounded text-xs">
            {leaderboardData.cohort.name.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="cyber-card">
        <h2 className="text-green-400 font-bold text-lg mb-4">TEAM PROGRESS</h2>
        {leaderboardData.teams && leaderboardData.teams.length > 0 ? (
          <div className="space-y-3">
            {leaderboardData.teams.map((team, index) => (
              <div key={team.id} className="border border-green-500/30 rounded p-3 flex justify-between items-center">
                <div className="text-left">
                  <div className="text-green-300 text-sm font-bold">
                    #{index + 1} {team.name}
                  </div>
                  <div className="text-green-500/50 text-xs">
                    ID: {team.id}
                  </div>
                </div>
                <div className="text-yellow-400 font-mono text-lg">
                  Level {team.currentLevel}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-green-500/50 text-sm">
            No teams found in this cohort
          </div>
        )}
      </div>

      <div className="text-xs text-green-500/50">
        <div>SECURE LEADERBOARD ACCESS</div>
      </div>
    </div>
  )
}
