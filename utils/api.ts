// Define standard API response structure
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
  
// Blog related interfaces
export interface BlogPost {
    id: number;
    title: string;
    content: string;
    image?: string;
    status: 'draft' | 'published';
    publishedAt?: string;
    userId: number;
    categoryId: number;
    category?: Category;
    author?: UserProfile;
}
  
export interface Category {
    id: number;
    name: string;
    description?: string;
}
  
// Helper function to check if a response is successful
export const isSuccessResponse = <T>(response: any): response is ApiResponse<T> => {
    return response && 
            typeof response === 'object' && 
            'success' in response && 
            response.success === true && 
            'data' in response;
};