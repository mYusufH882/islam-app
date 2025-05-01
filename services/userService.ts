import { useApi } from '~/composables/useApi';

// Interface untuk parameter dalam mendapatkan daftar pengguna
export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

// Interface untuk data pengguna
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

// Interface untuk data pagination
export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface untuk response daftar pengguna
export interface UserListResponse {
  users: User[];
  pagination: PaginationData;
}

// Interface untuk form data pengguna baru/update
export interface UserFormData {
  name: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  status: string;
}

/**
 * Service untuk manajemen pengguna
 */
export const userService = {
  /**
   * Mendapatkan daftar pengguna dengan paginasi dan filter
   * @param params - Parameter untuk mendapatkan daftar pengguna
   */
  async getUsers(params: UserListParams = {}) {
    const { apiFetch } = useApi();
    
    // Convert params menjadi query string
    const queryParams: Record<string, any> = {};
    
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.search) queryParams.search = params.search;
    if (params.role && params.role !== 'Semua Peran') queryParams.role = params.role;
    if (params.status) queryParams.status = params.status;
    
    return apiFetch<UserListResponse>('/admin/users', {
      method: 'GET',
      params: queryParams
    });
  },
  
  /**
   * Mendapatkan detail pengguna berdasarkan ID
   * @param id - ID pengguna
   */
  async getUserById(id: number) {
    const { apiFetch } = useApi();
    return apiFetch<User>(`/admin/users/${id}`);
  },
  
  /**
   * Membuat pengguna baru
   * @param userData - Data pengguna baru
   */
  async createUser(userData: UserFormData) {
    const { apiFetch } = useApi();
    return apiFetch<User>('/admin/users', {
      method: 'POST',
      body: userData
    });
  },
  
  /**
   * Memperbarui data pengguna
   * @param id - ID pengguna
   * @param userData - Data pengguna yang diperbarui
   */
  async updateUser(id: number, userData: UserFormData) {
    const { apiFetch } = useApi();
    return apiFetch<User>(`/admin/users/${id}`, {
      method: 'PUT',
      body: userData
    });
  },
  
  /**
   * Menghapus pengguna
   * @param id - ID pengguna
   */
  async deleteUser(id: number) {
    const { apiFetch } = useApi();
    return apiFetch(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  },
  
  /**
   * Mengubah status pengguna (activate/deactivate)
   * @param id - ID pengguna
   * @param status - Status baru ('active' atau 'inactive')
   */
  async updateUserStatus(id: number, status: 'active' | 'inactive') {
    const { apiFetch } = useApi();
    return apiFetch(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: { status }
    });
  }
};