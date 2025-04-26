// stores/auth.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { ApiResponse, AuthData, UserProfile } from '~/utils/api';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false
  }),
  
  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<AuthData>('/auth/login', {
          method: 'POST',
          body: { username, password }
        });
        
        if (error.value) {
          throw error.value;
        }
        
        if (data.value && data.value.success) {
          const authData = data.value.data;
          this.setAuthData(authData);
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    },
    
    async register(userData: { 
      username: string; 
      email: string; 
      password: string; 
      name: string;
    }): Promise<boolean> {
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<AuthData>('/auth/register', {
          method: 'POST',
          body: userData
        });
        
        if (error.value) {
          throw error.value;
        }
        
        if (data.value && data.value.success) {
          const authData = data.value.data;
          this.setAuthData(authData);
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Registration error:', error);
        return false;
      }
    },
    
    setAuthData(authData: AuthData): void {
      this.user = authData.user;
      this.token = authData.token;
      this.refreshToken = authData.refreshToken;
      this.isAuthenticated = true;
      
      // Store tokens in localStorage
      localStorage.setItem('auth_token', authData.token);
      localStorage.setItem('auth_refresh_token', authData.refreshToken);
    },
    
    logout(): void {
      // If we have a token, try to call the logout endpoint
      if (this.token && this.refreshToken) {
        const { apiFetch } = useApi();
        apiFetch('/auth/logout', {
          method: 'POST',
          body: { refreshToken: this.refreshToken }
        }).catch(error => {
          console.error('Logout API error:', error);
        });
      }
      
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      
      // Clear stored tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
    },
    
    async refreshTokenAction(): Promise<boolean> {
      if (!this.refreshToken) return false;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<{ token: string; refreshToken: string }>('/auth/refresh-token', {
          method: 'POST',
          body: { refreshToken: this.refreshToken }
        });
        
        if (error.value) {
          this.logout();
          return false;
        }
        
        if (data.value && data.value.success) {
          const tokenData = data.value.data;
          this.token = tokenData.token;
          this.refreshToken = tokenData.refreshToken;
          
          // Update stored tokens
          localStorage.setItem('auth_token', tokenData.token);
          localStorage.setItem('auth_refresh_token', tokenData.refreshToken);
          
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Token refresh error:', error);
        this.logout();
        return false;
      }
    },
    
    init(): void {
      // Check if we have stored tokens on app initialization
      const token = localStorage.getItem('auth_token');
      const refreshToken = localStorage.getItem('auth_refresh_token');
      
      if (token && refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.isAuthenticated = true;
        this.fetchUserProfile();
      }
    },
    
    async fetchUserProfile(): Promise<boolean> {
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<UserProfile>('/auth/profile');
        
        if (error.value) {
          this.logout();
          return false;
        }
        
        if (data.value && data.value.success) {
          this.user = data.value.data;
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Profile fetch error:', error);
        this.logout();
        return false;
      }
    }
  }
});