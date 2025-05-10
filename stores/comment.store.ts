import { defineStore } from 'pinia';
import { useApi } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';

// Interfaces
interface Comment {
  id: number;
  blogId: number;
  userId: number;
  parentId?: number | null;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    username: string;
    avatar?: string;
  };
  replies?: Comment[];
}

interface LoadingStates {
  fetch: boolean;
  create: boolean;
  reply: number | null; // ID komentar yang sedang dibalas
  update: number | null; // ID komentar yang sedang diupdate
  delete: number | null; // ID komentar yang sedang dihapus
}

interface CommentState {
  comments: Comment[];
  pendingComments: Comment[];
  loadingStates: LoadingStates;
  error: string | null;
  currentBlogId: number | null;
}

export const useCommentStore = defineStore('comment', {
  state: (): CommentState => ({
    comments: [],
    pendingComments: [],
    loadingStates: {
      fetch: false,
      create: false,
      reply: null,
      update: null,
      delete: null
    },
    error: null,
    currentBlogId: null
  }),
  
  getters: {
    // Mendapatkan komentar yang sudah diapprove dengan struktur bertingkat
    getApprovedComments: (state) => {
        // Pastikan state.comments tidak undefined
        if (!state.comments || !Array.isArray(state.comments)) {
            console.log('Comments array is empty or not an array');
            return [];
        }
        
        // PERBAIKAN: Log untuk debugging
        console.log('Total comments:', state.comments.length);
        console.log('Comments with approved status:', state.comments.filter(c => c.status === 'approved').length);
        
        // Mendapatkan komentar root (tanpa parent)
        const rootComments = state.comments
            .filter(c => !c.parentId && c.status === 'approved')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        console.log('Root comments count:', rootComments.length);
        
        // Mencari balasan untuk setiap komentar
        return rootComments.map(comment => {
            const replies = state.comments
                .filter(c => c.parentId === comment.id && c.status === 'approved')
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
            console.log(`Comment ${comment.id} has ${replies.length} replies`);
            
            return {
                ...comment,
                replies
            };
        });
    },
    
    // Mendapatkan semua komentar user (termasuk pending)
    getUserComments: (state) => {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;
      
      if (!userId) return [];
      
      return [...state.comments, ...state.pendingComments]
        .filter(c => c.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    },
    
    // Cek apakah komentar sedang pending
    isCommentPending: (state) => (commentId: number) => {
      return state.pendingComments.some(c => c.id === commentId);
    },
    
    // Cek apakah ada loading state
    isLoading: (state) => {
      return state.loadingStates.fetch || 
             state.loadingStates.create || 
             state.loadingStates.reply !== null ||
             state.loadingStates.update !== null ||
             state.loadingStates.delete !== null;
    }
  },
  
  actions: {
    // Mengambil komentar untuk blog tertentu
    async fetchComments(blogId: number) {
      if (this.loadingStates.fetch) return;
      
      this.loadingStates.fetch = true;
      this.error = null;
      this.currentBlogId = blogId;
      
      try {
        const { apiFetch } = useApi();
        
        // Tambahkan log untuk debugging
        console.log(`Fetching comments for blogId: ${blogId}`);
        
        const { data, error } = await apiFetch(`/blogs/${blogId}/comments`);
        
        if (error.value) {
          console.error('Error fetching comments:', error.value);
          throw new Error(error.value.message || 'Failed to fetch comments');
        }
        
        // Log data respons untuk debugging
        console.log('Response data structure:', data.value);
        
        if (data.value && data.value.success) {
          // PERBAIKAN: Struktur respons API adalah data langsung berupa array
          // data.value.data adalah array komentar, bukan objek yang memiliki property comments
          
          // Simpan semua komentar - berasal langsung dari data.value.data yang sudah berupa array
          const commentsArray = Array.isArray(data.value.data) ? data.value.data : [];
          console.log('Comments array from API:', commentsArray);
          
          // PENTING: Set langsung ke this.comments
          this.comments = commentsArray;
          
          // Filter komentar pending untuk user saat ini
          const authStore = useAuthStore();
          if (authStore.isAuthenticated) {
            const userId = authStore.user?.id;
            
            // Filter komentar pending hanya untuk user yang login
            const pendingUserComments = commentsArray.filter(
              c => c.status === 'pending' && c.userId === userId
            );
            
            // Set ke pendingComments
            this.pendingComments = pendingUserComments;
            
            console.log(`User has ${pendingUserComments.length} pending comments`);
          }
          
          // Log jumlah komentar yang disetujui untuk debugging
          const approvedCount = commentsArray.filter(c => c.status === 'approved').length;
          console.log(`Total ${commentsArray.length} comments loaded, ${approvedCount} approved`);
        }
      } catch (err: any) {
        console.error('Error fetching comments:', err);
        this.error = err.message || 'Failed to load comments';
      } finally {
        this.loadingStates.fetch = false;
      }
    },

    async fetchUserComments(status: string = 'all') {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return [];
      
      try {
        this.loadingStates.fetch = true;
        this.error = null;
        
        const { apiFetch } = useApi();
        
        // Pastikan endpoint benar
        const endpoint = status === 'all' 
          ? '/api/user/comments' 
          : `/api/user/comments?status=${status}`;
        
        console.log(`Calling API endpoint: ${endpoint}`);
        
        const { data, error } = await apiFetch(endpoint);
        
        if (error.value) {
          console.error(`API Error for ${endpoint}:`, error.value);
          throw new Error(error.value.message || 'Failed to fetch user comments');
        }
        
        if (data.value && data.value.success) {
          console.log(`Comments received from API:`, data.value.data.comments);
          return data.value.data.comments;
        }
        
        return [];
      } catch (err) {
        console.error('Error fetching user comments:', err);
        return [];
      } finally {
        this.loadingStates.fetch = false;
      }
    },
    
    // Count comments by status
    countCommentsByStatus() {
      if (!this.comments || !Array.isArray(this.comments)) {
        return { all: 0, pending: 0, approved: 0, rejected: 0 };
      }
      
      const counts = {
        all: this.comments.length,
        pending: 0,
        approved: 0,
        rejected: 0
      };
      
      for (const comment of this.comments) {
        if (comment.status === 'pending') counts.pending++;
        else if (comment.status === 'approved') counts.approved++;
        else if (comment.status === 'rejected') counts.rejected++;
      }
      
      return counts;
    },

    // Membuat komentar baru
    async createComment(content: string, blogId: number) {
    if (this.loadingStates.create) return null;
    
    // Validasi data
    if (!content || !blogId) {
        console.error('Content atau blogId tidak ada:', { content, blogId });
        this.error = 'Konten dan ID blog diperlukan';
        return null;
    }
    
    this.loadingStates.create = true;
    this.error = null;
    this.currentBlogId = blogId;
    
    try {
        const { apiFetch } = useApi();
        
        console.log('Sending request to backend:', {
        url: `/blogs/${blogId}/comments`,
        method: 'POST',
        content,
        blogId
        });
        
        // PENTING: Pastikan request dikirim sebagai POST dan format body benar
        const { data, error } = await apiFetch(
        `/blogs/${blogId}/comments`, 
        {
            method: 'POST',
            body: { 
            content: content,
            blogId: blogId
            }
        }
        );
        
        if (error.value) {
        console.error('Error response from API:', error.value);
        throw new Error(error.value.message || 'Failed to create comment');
        }
        
        // Log response untuk debugging
        console.log('Response from server:', data.value);
        
        if (data.value && data.value.success) {
        // PERBAIKAN: Pastikan kita memiliki data yang tepat
        // data tersedia di data.value.data
        const responseData = data.value.data;
        
        // Buat objek komentar dari respons
        // Jika respons tidak memiliki struktur yang diharapkan, buat struktur default
        const newComment: Comment = {
            id: responseData?.id || 0,
            blogId: blogId,
            userId: responseData?.userId || 0,
            parentId: responseData?.parentId || null,
            content: content,
            status: responseData?.status || 'pending',
            createdAt: responseData?.createdAt || new Date().toISOString(),
            updatedAt: responseData?.updatedAt || new Date().toISOString(),
            author: responseData?.author || {
            id: 0,
            name: 'User',
            username: 'user'
            }
        };
        
        // Tambahkan komentar ke state yang sesuai
        if (newComment.status === 'approved') {
            this.comments.push(newComment);
        } else {
            this.pendingComments.push(newComment);
        }
        
        console.log('Comment created successfully:', newComment);
        
        // Kembalikan objek komentar baru
        return newComment;
        }
        
        // Jika sukses tapi tidak ada data
        return {
        id: 0,
        blogId: blogId,
        userId: 0,
        content: content,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
            id: 0,
            name: 'User',
            username: 'user'
        }
        } as Comment;
        
    } catch (err: any) {
        console.error('Error creating comment:', err);
        this.error = err.message || 'Failed to create comment';
        return null;
    } finally {
        this.loadingStates.create = false;
    }
    },
    
    // Membalas komentar
    async replyToComment(parentId: number, content: string) {
      if (this.loadingStates.reply !== null || !this.currentBlogId) return null;
      
      this.loadingStates.reply = parentId;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        const { data, error } = await apiFetch(`/comments/${parentId}/reply`, {
          method: 'POST',
          body: { content, blogId: this.currentBlogId }
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to reply to comment');
        }
        
        if (data.value && data.value.success) {
          // PERBAIKAN: Fleksibel dalam mengekstrak data respons
          // Pertama coba data.value.data.comment, jika tidak ada, gunakan data.value.data
          const newReply = data.value.data.comment || data.value.data;
          
          // Jika reply langsung diapprove, tambahkan ke daftar komentar
          if (newReply?.status === 'approved') {
            this.comments.push(newReply);
          } 
          // Jika pending, tambahkan ke daftar pending
          else if (newReply?.status === 'pending') {
            this.pendingComments.push(newReply);
          }
          // Jika tidak ada status, tetap tambahkan ke daftar pending (fallback)
          else if (newReply) {
            this.pendingComments.push(newReply);
          }
          
          return newReply;
        }
        
        return null;
      } catch (err: any) {
        console.error('Error replying to comment:', err);
        this.error = err.message || 'Failed to reply to comment';
        return null;
      } finally {
        this.loadingStates.reply = null;
      }
    },
    
    // Mengupdate komentar
    async updateComment(commentId: number, content: string) {
      if (this.loadingStates.update !== null) return false;
      
      this.loadingStates.update = commentId;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        const { data, error } = await apiFetch(`/comments/${commentId}`, {
          method: 'PUT',
          body: { content }
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to update comment');
        }
        
        if (data.value && data.value.success) {
          // PERBAIKAN: Fleksibel dalam mengekstrak data respons
          // Jika data.value.data.comment ada gunakan itu, jika tidak gunakan data.value.data
          const updatedComment = data.value.data.comment || data.value.data;
          
          // PERBAIKAN: Pastikan comments dan pendingComments adalah array
          if (Array.isArray(this.comments)) {
            // Update di daftar komentar approved
            const commentIndex = this.comments.findIndex(c => c.id === commentId);
            if (commentIndex >= 0) {
              this.comments[commentIndex] = updatedComment;
            }
          }
          
          // PERBAIKAN: Pastikan pendingComments adalah array
          if (Array.isArray(this.pendingComments)) {
            // Atau update di daftar komentar pending
            const pendingIndex = this.pendingComments.findIndex(c => c.id === commentId);
            if (pendingIndex >= 0) {
              this.pendingComments[pendingIndex] = updatedComment;
            }
          }
          
          return true;
        }
        
        return false;
      } catch (err: any) {
        console.error('Error updating comment:', err);
        this.error = err.message || 'Failed to update comment';
        return false;
      } finally {
        this.loadingStates.update = null;
      }
    },
    
    // Menghapus komentar
    async deleteComment(commentId: number) {
      if (this.loadingStates.delete !== null) return false;
      
      this.loadingStates.delete = commentId;
      this.error = null;
      
      try {
        const { apiFetch } = useApi();
        const { data, error } = await apiFetch(`/comments/${commentId}`, {
          method: 'DELETE'
        });
        
        if (error.value) {
          throw new Error(error.value.message || 'Failed to delete comment');
        }
        
        if (data.value && data.value.success) {
          // PERBAIKAN: Pastikan comments dan pendingComments adalah array sebelum filter
          // Hapus dari daftar komentar
          if (Array.isArray(this.comments)) {
            this.comments = this.comments.filter(c => c.id !== commentId);
          }
          
          // Hapus dari daftar pending
          if (Array.isArray(this.pendingComments)) {
            this.pendingComments = this.pendingComments.filter(c => c.id !== commentId);
          }
          
          return true;
        }
        
        return false;
      } catch (err: any) {
        console.error('Error deleting comment:', err);
        this.error = err.message || 'Failed to delete comment';
        return false;
      } finally {
        this.loadingStates.delete = null;
      }
    },
    
    // Reset state saat navigasi
    // resetState() {
    //   this.comments = [];
    //   this.pendingComments = [];
    //   this.error = null;
    //   this.currentBlogId = null;
    //   this.loadingStates = {
    //     fetch: false,
    //     create: false,
    //     reply: null,
    //     update: null,
    //     delete: null
    //   };
    // }
    resetState() {
      const savedPendingComments = Array.isArray(this.pendingComments) ? [...this.pendingComments] : [];
      const currentBlogId = this.currentBlogId;
      
      this.comments = [];
      this.error = null;
      this.loadingStates = {
        fetch: false,
        create: false,
        reply: null,
        update: null,
        delete: null
      };
      
      // PERBAIKAN: Kembalikan komentar pending dan currentBlogId
      this.pendingComments = savedPendingComments;
      this.currentBlogId = currentBlogId;
      
      // PERBAIKAN: Tambahkan log untuk debugging
      console.log('Comment store state reset, pending comments preserved:', this.pendingComments.length);
    }
  }
});