import axios from 'axios';

// Configuration
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

console.log(`[API] Using backend at: ${API_BASE}`);

const client = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
});

// ============================================================================
// API Endpoints
// ============================================================================

/**
 * Health check - verify backend is running
 */
export const ping = async () => {
  try {
    const res = await client.get('/ping');
    return res.data;
  } catch (error) {
    console.error('[API] Ping failed:', error.message);
    throw error;
  }
};

/**
 * Get list of all available building labels
 */
export const getLabels = async () => {
  try {
    const res = await client.get('/labels');
    return res.data.labels;
  } catch (error) {
    console.error('[API] Get labels failed:', error.message);
    throw error;
  }
};

/**
 * Predict building class from image file
 * @param {File} imageFile - Image file from input
 * @returns {Promise} Prediction result {pred, confidence, probs, notes, gradcam_base64}
 */
export const predictImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const res = await client.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data;
  } catch (error) {
    console.error('[API] Predict failed:', error.message);
    throw error;
  }
};

// ============================================================================
// Helper Utilities
// ============================================================================

/**
 * Check if API is reachable
 */
export const isAPIReachable = async () => {
  try {
    await ping();
    return true;
  } catch {
    return false;
  }
};

export default client;
