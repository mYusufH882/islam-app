import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { ApiResponse, AuthData, UserProfile } from '~/utils/api';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  rememberedUser: {
    username?: string;
    email?: string;
    timestamp?: string;
  } | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    rememberedUser: null
  }),
  
  actions: {
    async login(username: string, password: string, rememberMe: boolean = false): Promise<boolean> {
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
          
          // Tambahkan ini: simpan flag "remember me" jika diaktifkan
          if (process.client && rememberMe) {
            // Simpan data pengguna untuk "remember me"
            const userToRemember = {
              username: authData.user.username || '',
              email: authData.user.email || '',
              timestamp: new Date().toISOString()
            };
            
            localStorage.setItem('remembered_user', JSON.stringify(userToRemember));
            localStorage.setItem('remember_me_enabled', 'true');
            this.rememberedUser = userToRemember;
            
            console.log('Remember me enabled, saved user data');
          } else if (process.client) {
            // Hapus data "remember me" jika tidak diaktifkan
            localStorage.removeItem('remembered_user');
            localStorage.removeItem('remember_me_enabled');
            this.rememberedUser = null;
          }
          
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
    
    logout(rememberUser = false): Promise<void> {
      return new Promise((resolve) => {
        // 1. Simpan refreshToken untuk API call
        const refreshToken = this.refreshToken;
        
        // PENTING: Simpan terlebih dahulu data user yang akan diingat SEBELUM mereset state
        // karena setelah state direset, this.user akan null
        let userToRemember = null;
        if (process.client && rememberUser && this.user) {
          try {
            userToRemember = {
              username: this.user.username || '',
              email: this.user.email || '',
              timestamp: new Date().toISOString()
            };
            
            // Simpan data sebelum state direset
            localStorage.setItem('remembered_user', JSON.stringify(userToRemember));
            localStorage.setItem('remember_me_enabled', 'true');
            
            console.log('User data saved for remember me:', userToRemember);
          } catch (error) {
            console.error('Error saving remembered user:', error);
          }
        }
        
        // 2. Clear state
        this.user = null;
        this.token = null;
        this.refreshToken = null;
        this.isAuthenticated = false;
        this.rememberedUser = null;
        
        // 3. Clear storage SECARA SELEKTIF berdasarkan flag rememberUser
        if (process.client) {
          // Token autentikasi selalu dihapus
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          
          // Hapus data "remember me" HANYA jika rememberUser = false
          // if (!rememberUser) {
          //   localStorage.removeItem('remembered_user');
          //   localStorage.removeItem('remember_me_enabled');
          //   console.log('Remember me data cleared');
          // } else {
          //   console.log('Remember me data preserved');
          // }
        }
        
        // 4. Call API logout (jika ada token)
        if (refreshToken) {
          const { apiFetch } = useApi();
          apiFetch('/auth/logout', {
            method: 'POST',
            body: { refreshToken }
          }).then(() => {
            resolve();
          }).catch((error) => {
            console.error('Logout API call failed, but client-side logout completed:', error);
            resolve(); // Tetap resolve untuk memastikan UI terupdate
          });
        } else {
          resolve();
        }
      });
    },

    getRememberedUser(): { username?: string; email?: string; } | null {
      if (!process.client) return null;
      
      try {
        // Cek apakah fitur "remember me" diaktifkan
        const rememberMeEnabled = localStorage.getItem('remember_me_enabled') === 'true';
        if (!rememberMeEnabled) return null;
        
        // Ambil data user dari localStorage
        const rememberedUserJson = localStorage.getItem('remembered_user');
        if (!rememberedUserJson) return null;
        
        const rememberedUser = JSON.parse(rememberedUserJson);
        
        // Validasi apakah sudah kedaluwarsa (7 hari)
        const storedTime = new Date(rememberedUser.timestamp || new Date()).getTime();
        const currentTime = new Date().getTime();
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        
        if (currentTime - storedTime > sevenDaysInMs) {
          // Sudah kedaluwarsa, hapus
          localStorage.removeItem('remembered_user');
          localStorage.removeItem('remember_me_enabled');
          this.rememberedUser = null;
          return null;
        }
        
        // Jika valid, update state dan kembalikan data
        this.rememberedUser = rememberedUser;
        
        console.log('Retrieved remembered user:', rememberedUser);
        
        return {
          username: rememberedUser.username || '',
          email: rememberedUser.email || ''
        };
      } catch (error) {
        console.error('Error retrieving remembered user:', error);
        localStorage.removeItem('remembered_user');
        localStorage.removeItem('remember_me_enabled');
        this.rememberedUser = null;
        return null;
      }
    },

    async init(): Promise<void> {      
      // Pastikan hanya dijalankan di sisi klien
      if (process.client) {
          const token = localStorage.getItem('auth_token');
          const refreshToken = localStorage.getItem('auth_refresh_token');
          
          // Load rememberedUser
          const rememberedUserJson = localStorage.getItem('remembered_user');
          if (rememberedUserJson) {
            try {
              this.rememberedUser = JSON.parse(rememberedUserJson);
            } catch (error) {
              console.error('Error parsing remembered user:', error);
              this.rememberedUser = null;
            }
          }
                    
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

    updateLastCommentAt(): void {
      if (this.user) {
        this.user = {
          ...this.user,
          lastCommentAt: new Date().toISOString()
        };
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