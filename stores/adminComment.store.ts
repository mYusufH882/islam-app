import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';

// Type definitions
interface CommentAuthor {
  id: number;
  name: string;
  username: string;
  avatar?: string;
}

interface CommentBlog {
  id: number;
  title: string;
}

interface Comment {
  id: number;
  content: string;
  blogId: number;
  userId: number;
  parentId?: number;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  isRead: boolean;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  author?: CommentAuthor;
  blog?: CommentBlog;
  parent?: Comment;
  replies?: Comment[];
}

interface CommentCounts {
  pending: number;
  approved: number;
  rejected: number;
  spam: number;
  unread: number;
  total: number;
}

interface CommentStats {
  statusCounts: CommentCounts;
  approvalRate: number;
  commentsByBlog: any[];
  commentsByDate: any[];
  activeUsers: any[];
}

interface CommentFilter {
  status?: string;
  blogId?: number;
  search?: string;
  isRead?: boolean;
  page: number;
  limit: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface AdminCommentState {
  comments: Comment[];
  commentStats: CommentStats | null;
  commentCounts: CommentCounts | null;
  filter: CommentFilter;
  pagination: Pagination;
  selectedComments: number[];
  loading: {
    list: boolean;
    stats: boolean;
    counts: boolean;
    action: boolean;
  };
  error: string | null;
}

export const useAdminCommentStore = defineStore('adminComment', {
  state: (): AdminCommentState => ({
    comments: [],
    commentStats: null,
    commentCounts: null,
    filter: {
      status: undefined,
      blogId: undefined,
      search: undefined,
      isRead: undefined,
      page: 1,
      limit: 10
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },
    selectedComments: [],
    loading: {
      list: false,
      stats: false,
      counts: false,
      action: false
    },
    error: null
  }),

  getters: {
    unreadCount(): number {
      return this.commentCounts?.unread || 0;
    },
    
    pendingCount(): number {
      return this.commentCounts?.pending || 0;
    },
    
    hasSelectedComments(): boolean {
      return this.selectedComments.length > 0;
    }
  },

  actions: {
    // Ambil daftar komentar dengan filter
    async fetchComments() {
      this.loading.list = true;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        
        // Siapkan parameter query
        const params: Record<string, any> = {
          page: this.filter.page,
          limit: this.filter.limit
        };
        
        if (this.filter.status) params.status = this.filter.status;
        if (this.filter.blogId) params.blogId = this.filter.blogId;
        if (this.filter.search) params.search = this.filter.search;
        if (this.filter.isRead !== undefined) params.isRead = this.filter.isRead;
        
        const { data, error } = await apiFetch<{
          comments: Comment[];
          pagination: Pagination;
        }>('/admin/comments', { params });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch comments');
        }
        
        if (data.value && data.value.success) {
          this.comments = data.value.data.comments;
          this.pagination = data.value.data.pagination;
        }
      } catch (err: any) {
        this.error = err.message || 'Error loading comments';
        console.error('Error fetching comments:', err);
      } finally {
        this.loading.list = false;
      }
    },
    
    // Ambil statistik komentar untuk dashboard
    async fetchCommentStats() {
      this.loading.stats = true;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<CommentStats>('/admin/comments/stats');
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch comment stats');
        }
        
        if (data.value && data.value.success) {
          this.commentStats = data.value.data;
        }
      } catch (err: any) {
        this.error = err.message || 'Error loading comment statistics';
        console.error('Error fetching comment stats:', err);
      } finally {
        this.loading.stats = false;
      }
    },
    
    // Ambil jumlah komentar berdasarkan status
    async fetchCommentCounts() {
      this.loading.counts = true;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch<CommentCounts>('/admin/comments/count');
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch comment counts');
        }
        
        if (data.value && data.value.success) {
          this.commentCounts = data.value.data;
        }
      } catch (err: any) {
        console.error('Error fetching comment counts:', err);
      } finally {
        this.loading.counts = false;
      }
    },
    
    // Update status komentar (approve/reject/spam)
    async updateCommentStatus(commentId: number, status: 'approved' | 'rejected' | 'spam', adminNote?: string) {
      this.loading.action = true;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch(`/admin/comments/${commentId}`, {
          method: 'PUT',
          body: { status, adminNote }
        });
        
        if (error.value) {
          throw new Error(error.value.message || `Failed to ${status} comment`);
        }
        
        if (data.value && data.value.success) {
          // Update komentar di daftar
          const index = this.comments.findIndex(c => c.id === commentId);
          if (index !== -1) {
            this.comments[index] = data.value.data;
          }
          
          // Refresh hitungan komentar
          await this.fetchCommentCounts();
          
          return true;
        }
        
        return false;
      } catch (err: any) {
        this.error = err.message;
        console.error(`Error updating comment status to ${status}:`, err);
        return false;
      } finally {
        this.loading.action = false;
      }
    },
    
    // Tandai komentar sebagai sudah dibaca
    async markAsRead(commentId: number) {
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch(`/admin/comments/${commentId}/read`, {
          method: 'PUT'
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to mark comment as read');
        }
        
        if (data.value && data.value.success) {
          // Update komentar di daftar
          const index = this.comments.findIndex(c => c.id === commentId);
          if (index !== -1) {
            this.comments[index].isRead = true;
          }
          
          // Refresh hitungan komentar
          await this.fetchCommentCounts();
          
          return true;
        }
        
        return false;
      } catch (err: any) {
        console.error('Error marking comment as read:', err);
        return false;
      }
    },
    
    // Hapus komentar
    async deleteComment(commentId: number) {
      this.loading.action = true;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch(`/admin/comments/${commentId}`, {
          method: 'DELETE'
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to delete comment');
        }
        
        if (data.value && data.value.success) {
          // Hapus komentar dari daftar
          this.comments = this.comments.filter(c => c.id !== commentId);
          
          // Refresh hitungan komentar
          await this.fetchCommentCounts();
          
          return true;
        }
        
        return false;
      } catch (err: any) {
        this.error = err.message;
        console.error('Error deleting comment:', err);
        return false;
      } finally {
        this.loading.action = false;
      }
    },
    
    // Aksi massal pada komentar terpilih
    async bulkAction(action: 'approve' | 'reject' | 'spam' | 'delete' | 'markAsRead', adminNote?: string) {
      if (this.selectedComments.length === 0) return false;
      
      this.loading.action = true;
      
      try {
        const { apiFetch } = useApi();
        
        const { data, error } = await apiFetch('/admin/comments/bulk-action', {
          method: 'POST',
          body: {
            commentIds: this.selectedComments,
            action,
            adminNote
          }
        });
        
        if (error.value) {
          throw new Error(error.value.message || `Failed to ${action} comments`);
        }
        
        if (data.value && data.value.success) {
          // Refresh daftar dan statistik
          await this.fetchComments();
          await this.fetchCommentCounts();
          
          // Reset pilihan
          this.selectedComments = [];
          
          return true;
        }
        
        return false;
      } catch (err: any) {
        this.error = err.message;
        console.error(`Error performing bulk action ${action}:`, err);
        return false;
      } finally {
        this.loading.action = false;
      }
    },
    
    // Set filter dan reload data
    setFilter(filter: Partial<CommentFilter>) {
      // Reset halaman jika filter berubah
      if (filter.status !== undefined || filter.blogId !== undefined || 
          filter.search !== undefined || filter.isRead !== undefined) {
        this.filter.page = 1;
      }
      
      // Update filter
      this.filter = { ...this.filter, ...filter };
      
      // Refresh data
      this.fetchComments();
    },
    
    // Navigasi halaman
    setPage(page: number) {
      if (page < 1 || page > this.pagination.totalPages) return;
      
      this.filter.page = page;
      this.fetchComments();
    },
    
    // Toggle pilihan komentar
    toggleCommentSelection(commentId: number) {
      const index = this.selectedComments.indexOf(commentId);
      if (index === -1) {
        this.selectedComments.push(commentId);
      } else {
        this.selectedComments.splice(index, 1);
      }
    },
    
    // Pilih semua komentar di halaman saat ini
    selectAllComments() {
      this.selectedComments = this.comments.map(c => c.id);
    },
    
    // Batalkan pilihan semua komentar
    clearSelection() {
      this.selectedComments = [];
    }
  }
});