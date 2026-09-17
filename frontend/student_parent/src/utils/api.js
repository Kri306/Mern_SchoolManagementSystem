export const API_BASE_URL = 'http://localhost:5004/api/student-parent';

export const apiFetch = async (endpoint, token, handleLogout, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401 || response.status === 403) {
      if (handleLogout) {
        handleLogout();
      }
      throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};
