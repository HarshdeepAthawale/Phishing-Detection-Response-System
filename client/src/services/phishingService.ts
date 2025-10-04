import axios from 'axios';
import { AnalysisResult } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL || 'https://phishing-detection-response-system.onrender.com/api'
  : 'http://localhost:5000/api';

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/detect`, {
      url: url
    }, {
      timeout: 30000, // 30 second timeout
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: false
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Analysis failed');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Analysis timed out. Please try again.');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many requests. Please wait a moment and try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    throw new Error('Failed to analyze URL. Please check your connection and try again.');
  }
};

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000
    });
    return response.data.status === 'OK';
  } catch {
    return false;
  }
};

export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics`, {
      timeout: 10000
    });
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch analytics');
  }
};
