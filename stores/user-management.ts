// stores/user-management.ts
import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { ApiResponse } from '~/utils/api';

// Perbaiki interface User dengan menambahkan password field
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  password?: string;  // Tambahkan field password sebagai optional
  lastLogin?: string | Date;
  createdAt?: string;
}

// Interface untuk data yang dikirim saat membuat user baru
interface CreateUserData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  status: 'active' | 'inactive';
}

// Interface untuk data yang dikirim saat update user
interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: 'active' | 'inactive';
}

interface UserPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface UserState {
  users: User[];
  selectedUser: User | null;
  pagination: UserPagination;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  status: string;
}

export const useUserManagementStore = defineStore('userManagement', {
  state: (): UserState => ({
    users: [],
    selectedUser: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },
    loading: false,
    error: null,
    searchQuery: '',
    status: ''
  }),
  
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        
        const params = new URLSearchParams();
        
        if (this.searchQuery) {
          params.append('search', this.searchQuery);
        }
        
        if (this.status) {
          params.append('status', this.status);
        }
        
        params.append('page', this.pagination.page.toString());
        params.append('limit', this.pagination.limit.toString());
        
        const { data, error } = await apiFetch<{
          users: User[];
          pagination: UserPagination;
        }>(`/admin/users?${params.toString()}`);
        
        if (error.value) {
          throw new Error(error.value.message || 'Gagal mengambil data pengguna');
        }
        
        if (data.value && data.value.success) {
          this.users = data.value.data.users;
          this.pagination = data.value.data.pagination;
        }
      } catch (err: any) {
        this.error = err.message || 'Terjadi kesalahan saat mengambil data pengguna';
        console.error('Fetch users error:', err);
      } finally {
        this.loading = false;
      }
    },
    
    setPage(page: number) {
      this.pagination.page = page;
      this.fetchUsers();
    },
    
    setLimit(limit: number) {
      this.pagination.limit = limit;
      this.pagination.page = 1;
      this.fetchUsers();
    },
    
    setSearchQuery(query: string) {
      this.searchQuery = query;
      this.pagination.page = 1;
      this.fetchUsers();
    },
    
    setStatus(status: string) {
      this.status = status;
      this.pagination.page = 1;
      this.fetchUsers();
    },

    // Fungsi create user dengan interface spesifik untuk data
    async createUser(userData: CreateUserData) {
      this.loading = true;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<User>('/admin/users', {
          method: 'POST',
          body: userData
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Gagal membuat pengguna baru');
        }
        
        if (data.value && data.value.success) {
          await this.fetchUsers();
          return true;
        }
        
        return false;
      } catch (err: any) {
        this.error = err.message || 'Terjadi kesalahan saat membuat pengguna baru';
        console.error('Create user error:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // Fungsi update user dengan interface spesifik untuk data
    async updateUser(id: number, userData: UpdateUserData) {
      this.loading = true;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<User>(`/admin/users/${id}`, {
          method: 'PUT',
          body: userData
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Gagal mengupdate pengguna');
        }
        
        if (data.value && data.value.success) {
          await this.fetchUsers();
          return true;
        }
        
        return false;
      } catch (err: any) {
        this.error = err.message || 'Terjadi kesalahan saat mengupdate pengguna';
        console.error('Update user error:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch(`/admin/users/${id}`, {
          method: 'DELETE'
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Gagal menghapus pengguna');
        }
        
        if (data.value && data.value.success) {
          await this.fetchUsers();
          return true;
        }
        
        return false;
      } catch (err: any) {
        this.error = err.message || 'Terjadi kesalahan saat menghapus pengguna';
        console.error('Delete user error:', err);
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});

// Export interface untuk penggunaan di komponen
export type { User, CreateUserData, UpdateUserData };