// API service for InkOverMatter
const API_BASE_URL = 'http://localhost:5000';

/**
 * Fetch the full gallery from the backend API
 * @returns {Promise<Array>} Array of gallery images
 */
export const fetchFullGallery = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/view_full_gallery`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery:', error);
    // Return fallback data if API fails
    return [];
  }
};

/**
 * Send a booking request
 * @param {Object} bookingData - The booking form data
 * @returns {Promise<Object>} Response from booking API
 */
export const submitBooking = async (bookingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submit_booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting booking:', error);
    throw error;
  }
};