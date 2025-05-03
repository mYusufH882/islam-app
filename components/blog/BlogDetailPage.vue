<template>
    <div>
        <!-- Back Button -->
        <div class="mb-4">
            <NuxtLink to="/blog" class="inline-flex items-center text-blue-600">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Blog
            </NuxtLink>
        </div>

        <!-- Article Content -->
        <div v-if="article" class="bg-white rounded-lg shadow overflow-hidden mb-6">
            <!-- Article Header Image -->
            <div class="h-48 sm:h-64 bg-gray-200">
                <img 
                    v-if="article.image"
                    :src="getImageUrl(article.image)" 
                    :alt="article.title"
                    class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            
            <!-- Article Meta -->
            <div class="p-4 sm:p-6">
                <div class="flex items-center mb-3">
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {{ getCategoryName(article.categoryId) }}
                    </span>
                    <span class="ml-2 text-xs text-gray-500">
                        {{ formatDate(article.date) }}
                    </span>
                </div>
                
                <!-- Article Title -->
                <h1 class="text-2xl font-bold mb-4">{{ article.title }}</h1>
                
                <!-- Article Content -->
                <div class="prose prose-blue max-w-none" v-html="sanitizedContent"></div>
            </div>
        </div>
        
        <!-- Loading State -->
        <div v-else-if="loading" class="bg-white p-6 rounded-lg shadow text-center">
            <div class="animate-pulse space-y-4">
                <div class="h-48 bg-gray-200 rounded"></div>
                <div class="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div class="space-y-2">
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-4 bg-gray-200 rounded"></div>
                    <div class="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
            <p class="mt-4 text-gray-500">Memuat artikel...</p>
        </div>

        <!-- Error State -->
        <div v-else class="bg-white p-6 rounded-lg shadow text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Artikel tidak ditemukan</h3>
            <p class="mt-1 text-sm text-gray-500">
                Maaf, artikel yang Anda cari tidak ditemukan atau telah dihapus.
            </p>
            <div class="mt-6">
                <NuxtLink to="/blog" class="text-blue-600 font-medium">
                    Kembali ke daftar artikel
                </NuxtLink>
            </div>
        </div>
        
        <!-- Related Articles -->
        <div v-if="article && relatedArticles.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Artikel Terkait</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                    v-for="relatedArticle in relatedArticles" 
                    :key="relatedArticle.id"
                    class="bg-white p-3 rounded-lg shadow flex items-start space-x-3"
                >
                    <div class="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0">
                        <img 
                            v-if="relatedArticle.image"
                            :src="getImageUrl(relatedArticle.image)"
                            :alt="relatedArticle.title"
                            class="w-full h-full object-cover rounded-md"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center">
                            <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h4 class="font-medium line-clamp-1">{{ relatedArticle.title }}</h4>
                        <p class="text-xs text-gray-500 mt-1">{{ formatDate(relatedArticle.date) }}</p>
                        <NuxtLink 
                            :to="`/blog/${relatedArticle.id}`" 
                            class="text-xs text-blue-600 mt-1 inline-block"
                        >
                            Baca selengkapnya
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Share Buttons -->
        <div v-if="article" class="bg-white p-4 rounded-lg shadow mb-6">
            <h3 class="text-sm font-medium mb-3">Bagikan Artikel</h3>
            <div class="flex space-x-2">
                <button @click="shareArticle('facebook')" class="p-2 bg-blue-500 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </button>
                <button @click="shareArticle('twitter')" class="p-2 bg-blue-400 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                </button>
                <button @click="shareArticle('whatsapp')" class="p-2 bg-green-500 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                </button>
                <button @click="copyArticleLink" class="p-2 bg-gray-500 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Comments Section -->
        <div v-if="article" class="bg-white p-4 rounded-lg shadow mb-6">
            <h3 class="text-lg font-semibold mb-3">Komentar ({{ comments.length }})</h3>
            
            <!-- Comment Form -->
            <div class="mb-4">
                <textarea 
                    v-model="commentText"
                    placeholder="Tulis komentar Anda..." 
                    class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                ></textarea>
                <button 
                    @click="submitComment"
                    class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Kirim Komentar
                </button>
            </div>
            
            <!-- Comments List -->
            <div class="space-y-4">
                <div v-for="(comment, index) in comments" :key="index" class="border-b border-gray-100 pb-4 last:border-0">
                    <div class="flex items-start">
                        <div class="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500">
                            {{ getInitials(comment.author) }}
                        </div>
                        <div class="ml-3 flex-1">
                            <div class="flex items-center justify-between">
                                <h4 class="font-medium">{{ comment.author }}</h4>
                                <span class="text-xs text-gray-500">{{ comment.date }}</span>
                            </div>
                            <p class="text-gray-800 mt-1">{{ comment.text }}</p>
                            <button @click="replyToComment(index)" class="text-xs text-blue-600 mt-1">Balas</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useBlogStore } from '~/stores/blog.store';
import { storeToRefs } from 'pinia';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { getImageUrl } from '~/utils/imageHelper';

const route = useRoute();
const articleId = computed(() => Number(route.params.id));

// Blog store
const blogStore = useBlogStore();
const { blogs, categories: storeCategories, loading, error, selectedBlog } = storeToRefs(blogStore);

// Comment state
const commentText = ref('');
const comments = ref([
    {
        author: 'Ahmad Fadhil',
        date: '3 jam yang lalu',
        text: 'Artikel yang sangat bermanfaat, jazakallahu khairan.'
    },
    {
        author: 'Siti Rahmah',
        date: '1 hari yang lalu',
        text: 'Alhamdulillah, saya jadi lebih memahami pentingnya amal ibadah ini. Semoga kita bisa mengamalkannya dengan istiqomah.'
    },
    {
        author: 'Muhammad Rizky',
        date: '3 hari yang lalu',
        text: 'Mohon penjelasan lebih lanjut tentang dalil-dalil yang menguatkan pembahasan ini. Syukron.'
    }
]);

// Computed properties
const article = computed(() => {
    if (selectedBlog.value) return selectedBlog.value;
    return blogs.value.find(article => article.id === articleId.value);
});

const sanitizedContent = computed(() => {
    if (!article.value?.content) return '';
    
    try {
        // Parse markdown to HTML
        const rawHtml = marked.parse(article.value.content);
        // Sanitize HTML to prevent XSS
        if (typeof window !== 'undefined' && DOMPurify) {
            return DOMPurify.sanitize(rawHtml);
        }
        return rawHtml;
    } catch (err) {
        console.error('Error parsing content:', err);
        return '';
    }
});

const relatedArticles = computed(() => {
    if (!article.value) return [];
    
    // Get articles with same category, excluding current article
    return blogs.value
        .filter(a => a.categoryId === article.value.categoryId && a.id !== article.value.id)
        .slice(0, 2);
});

// Methods
const fetchArticle = async () => {
    await blogStore.fetchBlogById(articleId.value);
};

const getCategoryName = (categoryId) => {
    const category = storeCategories.value.find(cat => cat.id === categoryId);
    return category ? category.name : 'Umum';
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getInitials = (name) => {
    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

const submitComment = () => {
    if (commentText.value.trim()) {
        comments.value.unshift({
            author: 'Anda',
            date: 'Baru saja',
            text: commentText.value
        });
        commentText.value = '';
    }
};

const replyToComment = (index) => {
    const author = comments.value[index].author;
    commentText.value = `@${author} `;
    // Focus on comment textarea
    setTimeout(() => {
        document.querySelector('textarea').focus();
    }, 0);
};

const shareArticle = (platform) => {
    if (!article.value) return;
    
    const url = window.location.href;
    const title = article.value.title;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
};

const copyArticleLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            alert('Link artikel berhasil disalin!');
        })
        .catch(err => {
            console.error('Gagal menyalin link:', err);
        });
};

// Fetch article and categories if needed
onMounted(async () => {
    // Fetch categories if not already loaded
    if (storeCategories.value.length === 0) {
        await blogStore.fetchCategories();
    }
    
    // Fetch the article if not in the store
    if (!article.value) {
        await fetchArticle();
    }
});
</script>

<style scoped>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.prose h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
}

.prose p {
    margin-bottom: 1rem;
}

.prose ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
}

.prose blockquote {
    border-left: 4px solid #e5e7eb;
    padding-left: 1rem;
    font-style: italic;
    margin: 1.5rem 0;
    color: #4b5563;
}
</style>