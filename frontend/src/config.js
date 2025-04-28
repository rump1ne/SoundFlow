export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://localhost:5173/callback'
  }
}; 