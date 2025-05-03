import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import type { Blog, Category } from '~/types/blog';

interface BlogPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface untuk state blog store
interface BlogState {
  blogs: Blog[];
  categories: Category[];
  selectedBlog: Blog | null;
  pagination: BlogPagination;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  categoryFilter: number | null;
  statusFilter: string;
}

export const useBlogStore = defineStore('blog', {
    state: (): BlogState => ({
        blogs: [],
        categories: [],
        selectedBlog: null,
        pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
        },
        loading: false,
        error: null,
        searchQuery: '',
        categoryFilter: null,
        statusFilter: ''
    }),

    actions: {
        async fetchBlogs() {
            this.loading = true;
            this.error = null;
          
            try {
              const { apiFetch } = useApi();
              
              const params = new URLSearchParams();
              
              // Add search parameter if present
              if (this.searchQuery) {
                params.append('search', this.searchQuery);
              }
              
              // Add category parameter if present
              if (this.categoryFilter !== null) {
                params.append('category', this.categoryFilter.toString());
              }
              
              // Important: Only add status parameter if a specific status is selected
              if (this.statusFilter !== null) {
                params.append('status', this.statusFilter);
              }
              
              // Add pagination parameters
              params.append('page', this.pagination.page.toString());
              params.append('limit', this.pagination.limit.toString());
              
              console.log(`Fetching blogs with params: ${params.toString()}`);
              
              const { data, error } = await apiFetch(`/blogs?${params.toString()}`);
              
              if (error.value) {
                throw new Error(error.value.message || 'Failed to fetch blogs');
              }
              
              if (data.value && data.value.success) {
                this.blogs = data.value.data.blogs;
                this.pagination = data.value.data.pagination;
                console.log('Fetched blogs with statuses:', this.blogs.map(blog => blog.status));
              }
            } catch (err) {
              console.error('Fetch blogs error:', err);
            } finally {
              this.loading = false;
            }
        },

        async fetchCategories() {
            try {
                const { apiFetch } = useApi();
                
                const { data, error } = await apiFetch<Category[]>('/categories');
                
                if (error.value) {
                    throw new Error(error.value.message || 'Gagal mengambil data kategori');
                }
                
                if (data.value && data.value.success) {
                    this.categories = data.value.data;
                }
            } catch (err: any) {
                console.error('Fetch categories error:', err);
                // Tidak menampilkan error kategori di UI untuk kesederhanaan
            }
        },

        async fetchBlogById(id: number) {
            this.loading = true;
            this.error = null;

            try {
                const { apiFetch } = useApi();
                
                const { data, error } = await apiFetch<Blog>(`/blogs/${id}`);
                
                if (error.value) {
                    throw new Error(error.value.message || `Gagal mengambil detail blog dengan ID ${id}`);
                }
                
                if (data.value && data.value.success) {
                    this.selectedBlog = data.value.data;
                }
            } catch (err: any) {
                this.error = err.message || 'Terjadi kesalahan saat mengambil detail blog';
                console.error('Fetch blog by id error:', err);
            } finally {
                this.loading = false;
            }
        },

        async createBlog(blogData: FormData) {
            this.loading = true;
            this.error = null;
            
            try {
              const { apiFetch } = useApi();
              
              const { data, error } = await apiFetch<Blog>('/blogs', {
                method: 'POST',
                // Tidak perlu menambahkan Content-Type, browser akan otomatis menambahkan
                // dengan boundary yang diperlukan untuk multipart/form-data
                body: blogData,
                // Pastikan tidak ada transformasi JSON
                headers: {
                  'Accept': 'application/json'
                }
              });
              
              if (error.value) {
                throw new Error(error.value.message || 'Gagal membuat blog baru');
              }
              
              if (data.value && data.value.success) {
                await this.fetchBlogs();
                return true;
              }
              
              return false;
            } catch (err) {
              console.error('Create blog error:', err);
              return false;
            } finally {
              this.loading = false;
            }
        },
          
        async updateBlog(id: number, blogData: FormData) {
            this.loading = true;
            this.error = null;
            
            try {
              const { apiFetch } = useApi();
              
              const { data, error } = await apiFetch<Blog>(`/blogs/${id}`, {
                method: 'PUT',
                body: blogData,
                headers: {
                  'Accept': 'application/json'
                }
              });
              
              if (error.value) {
                throw new Error(error.value.message || 'Gagal mengupdate blog');
              }
              
              if (data.value && data.value.success) {
                await this.fetchBlogs();
                return true;
              }
              
              return false;
            } catch (err) {
              console.error('Update blog error:', err);
              return false;
            } finally {
              this.loading = false;
            }
        },
        
        async deleteBlog(id: number) {
            this.loading = true;
            this.error = null;
            
            try {
                const { apiFetch } = useApi();
                
                const { data, error } = await apiFetch(`/blogs/${id}`, {
                    method: 'DELETE'
                });
                
                if (error.value) {
                    throw new Error(error.value.message || 'Gagal menghapus blog');
                }
                
                if (data.value && data.value.success) {
                    await this.fetchBlogs();
                    return true;
                }
                
                return false;
            } catch (err: any) {
                this.error = err.message || 'Terjadi kesalahan saat menghapus blog';
                console.error('Delete blog error:', err);
                return false;
            } finally {
                this.loading = false;
            }
        },

        // Fungsi untuk filter dan pagination
        setPage(page: number) {
            this.pagination.page = page;
            this.fetchBlogs();
        },

        setLimit(limit: number) {
            this.pagination.limit = limit;
            this.pagination.page = 1; // Reset halaman saat mengubah limit
            this.fetchBlogs();
        },

        setSearchQuery(query: string) {
            this.searchQuery = query;
            this.pagination.page = 1; // Reset halaman saat melakukan pencarian
            this.fetchBlogs();
        },

        setCategoryFilter(categoryId: number | null) {
            this.categoryFilter = categoryId;
            this.pagination.page = 1; // Reset halaman saat mengubah filter kategori
            this.fetchBlogs();
        },

        setStatusFilter(status: string) {
            this.statusFilter = status;
            this.pagination.page = 1; // Reset halaman saat mengubah filter status
            this.fetchBlogs();
        }
    }
});