import axios from 'axios'

const API_BASE_URL = 'http://localhost:4001'

export interface ScanResponse {
  message: string
  currentLevel: number
  flag: string
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
  } catch (error: any) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw {
      error: 'Network Error',
      details: 'Unable to connect to the server'
    }
  }
}
