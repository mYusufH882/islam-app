export interface Category {
    id: number;
    name: string;
    description?: string;
}
  
export interface Blog {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    image?: string;
    status: 'draft' | 'published';
    publishedAt?: string;
    userId: number;
    categoryId: number;
    category?: Category;
    author?: {
      id: number;
      name: string;
      username: string;
    };
    createdAt?: string;
    updatedAt?: string;
    removeImage?: boolean;
}