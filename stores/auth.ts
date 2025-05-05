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
      if (process.client) {
        localStorage.setItem('auth_token', authData.token)
        localStorage.setItem('auth_refresh_token', authData.refreshToken)
      }
    },
    
    logout(): Promise<void> {
      return new Promise((resolve) => {
        // 1. Simpan refreshToken untuk API call
        const refreshToken = this.refreshToken
        
        // 2. Clear state immediately
        this.user = null
        this.token = null
        this.refreshToken = null
        this.isAuthenticated = false
        
        // 3. Clear storage
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_refresh_token')
        }
        
        // 4. Call API logout (fire and forget)
        if (refreshToken) {
          const { apiFetch } = useApi()
          apiFetch('/auth/logout', {
            method: 'POST',
            body: { refreshToken }
          }).finally(resolve)
        } else {
          resolve()
        }
      })
    },

    async init(): Promise<void> {      
      // Pastikan hanya dijalankan di sisi klien
      if (process.client) {;
          const token = localStorage.getItem('auth_token');
          const refreshToken = localStorage.getItem('auth_refresh_token');
                    
          if (token && refreshToken) {
              this.token = token;
              this.refreshToken = refreshToken;
              
              try {
                  const profileFetched = await this.fetchUserProfile();
                  this.isAuthenticated = profileFetched;
              } catch (error) {
                  console.error('Init error:', error);
                  this.logout();
              }
          } else {
              this.logout();
          }
      }
    },
  
    async fetchUserProfile(): Promise<boolean> {
        // Pastikan hanya dijalankan di sisi klien
        if (process.server) {
            return false;
        }
    
        try {
            const { apiFetch } = useApi();
            
            const { data, error } = await apiFetch<UserProfile>('/auth/profile');
    
            if (error.value) {
                this.logout();
                return false;
            }
            
            if (data.value && data.value.success) {
                this.user = data.value.data;
                this.isAuthenticated = true;
                
                return true;
            }
            
            this.logout();
            return false;
        } catch (error) {
            this.logout();
            return false;
        }
    },

    async refreshTokenAction(): Promise<boolean> {
        if (!this.refreshToken) return false;
        
        try {
            const { apiFetch } = useApi();
            
            const { data, error } = await apiFetch<AuthData>('/auth/refresh-token', {
                method: 'POST',
                body: { refreshToken: this.refreshToken }
            });
            
            if (error.value) {
                this.logout();
                return false;
            }
            
            if (data.value && data.value.success) {
                const authData = data.value.data;
                this.setAuthData(authData);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.logout();
            return false;
        }
    }
  }
});