import type { Blog } from '~/types/blog';  // Menggunakan import type

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

// Define common response types
export interface AuthData {
    user: UserProfile;
    token: string;
    refreshToken: string;
}

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    name: string;
    role: string;
    lastLogin?: string;
}

// Gunakan interface dari types.ts
export type BlogPost = Blog;

// Helper function
export const isSuccessResponse = <T>(response: any): response is ApiResponse<T> => {
    return response && 
            typeof response === 'object' && 
            'success' in response && 
            response.success === true && 
            'data' in response;
};