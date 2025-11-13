import axios from 'axios'

const API_BASE_URL = 'http://localhost:4001'

export interface ScanResponse {
  message: string
  currentLevel: number
  flag: string
}

export interface TeamData {
  id: string
  name: string
  currentLevel: number
  cohort: {
    id: number
    name: string
  }
  capturedFlags?: Flag[]
}

export interface CohortTeamsData {
  cohort: {
    id: number
    name: string
  } | null
  teams: {
    id: string
    name: string
    currentLevel: number
  }[]
}

export interface Flag {
  level: number
  flag: string
  capturedAt: string
}

export interface ApiError {
  error: string
  details?: string
}

export const scanQR = async (
  cohort: number,
  level: number,
  teamId: string
): Promise<ScanResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/scan/${cohort}/${level}`, {
      teamId: teamId.trim()
    })

    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}

export const getTeamData = async (teamId: string): Promise<TeamData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/team/${teamId}`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}

export const getCohortTeams = async (cohortId: number): Promise<CohortTeamsData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cohort/${cohortId}/teams`)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}
