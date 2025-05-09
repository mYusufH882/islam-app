import { useApi } from '~/composables/useApi';

export interface Comment {
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

export const useCommentService = () => {
  const { apiFetch } = useApi();
  
  // Mengambil komentar untuk blog tertentu
  const getComments = async (blogId: number) => {
    return apiFetch<{ comments: Comment[], pendingComments?: Comment[] }>(`/blogs/${blogId}/comments`);
  };
  
  // Membuat komentar baru
  const createComment = async (blogId: number, content: string) => {
    return apiFetch<{ comment: Comment }>(`/blogs/${blogId}/comments`, {
      method: 'POST',
      body: { content }
    });
  };
  
  // Membalas komentar
  const replyToComment = async (commentId: number, blogId: number, content: string) => {
    return apiFetch<{ comment: Comment }>(`/comments/${commentId}/reply`, {
      method: 'POST',
      body: { content, blogId }
    });
  };
  
  // Mengupdate komentar
  const updateComment = async (commentId: number, content: string) => {
    return apiFetch<{ comment: Comment }>(`/comments/${commentId}`, {
      method: 'PUT',
      body: { content }
    });
  };
  
  // Menghapus komentar
  const deleteComment = async (commentId: number) => {
    return apiFetch(`/comments/${commentId}`, {
      method: 'DELETE'
    });
  };
  
  return {
    getComments,
    createComment,
    replyToComment,
    updateComment,
    deleteComment
  };
};