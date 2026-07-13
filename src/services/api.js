import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If data is FormData, let browser set Content-Type automatically
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Automatically refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post(`${API_BASE}/api/users/token/refresh/`, {
          refresh,
        });
        localStorage.setItem('access_token', res.data.access);
        original.headers.Authorization = `Bearer ${res.data.access}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/api/users/register/', data),
  login: (data) => api.post('/api/users/login/', data),
  logout: (data) => api.post('/api/users/logout/', data),
  profile: () => api.get('/api/users/profile/'),
  refreshToken: (data) => api.post('/api/users/token/refresh/', data),
};

// Events
export const eventsAPI = {
  list: () => api.get('/api/events/'),
  detail: (id) => api.get(`/api/events/${id}/`),
  create: (data) => api.post('/api/events/', data),   // data is FormData from CreateEvent
  update: (id, data) => api.put(`/api/events/${id}/`, data),
  delete: (id) => api.delete(`/api/events/${id}/`),
  createTier: (eventId, data) => api.post(`/api/events/${eventId}/tiers/`, data),
  listTiers: (eventId) => api.get(`/api/events/${eventId}/tiers/`),
  updateTier: (eventId, tierId, data) => api.put(`/api/events/${eventId}/tiers/${tierId}/`, data),
  deleteTier: (eventId, tierId) => api.delete(`/api/events/${eventId}/tiers/${tierId}/`),
};

// Tickets
export const ticketsAPI = {
  purchase: (data) => api.post('/api/tickets/purchase/', data),
  paymentStatus: (checkoutId) => api.get(`/api/tickets/status/${checkoutId}/`),
  myTickets: () => api.get('/api/tickets/my-tickets/'),
  ticketDetail: (id) => api.get(`/api/tickets/my-tickets/${id}/`),
  scan: (data) => api.post('/api/tickets/scan/', data),
};

// Marketplace
export const marketplaceAPI = {
  listings: () => api.get('/api/marketplace/listings/'),
  createListing: (data) => api.post('/api/marketplace/listings/create/', data),
  myListings: () => api.get('/api/marketplace/listings/my/'),
  purchaseListing: (id, data) => api.post(`/api/marketplace/listings/${id}/purchase/`, data),
  cancelListing: (id) => api.post(`/api/marketplace/listings/${id}/cancel/`),
  paymentStatus: (checkoutId) => api.get(`/api/marketplace/payment-status/${checkoutId}/`),
};

// Analytics
export const analyticsAPI = {
  eventStats: (eventId) => api.get(`/api/analytics/events/${eventId}/`),
};

export default api;