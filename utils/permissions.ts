import type { UserProfile } from './api';

export const canAccessAdmin = (user: UserProfile | null): boolean => {
  return !!user && user.role === 'admin';
};

export const canManageBlogs = (user: UserProfile | null): boolean => {
  return !!user && (user.role === 'admin' || user.role === 'user');
};

export const isOwner = (user: UserProfile | null, resourceUserId: number): boolean => {
  return !!user && (user.id === resourceUserId || user.role === 'admin');
};