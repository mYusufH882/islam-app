<template>
    <div>
        <!-- Page Header -->
        <div class="mb-6">
            <h1 class="text-2xl font-bold">Blog Islami</h1>
            <p class="text-gray-600">Artikel dan tulisan inspiratif islami</p>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <div class="relative">
                <input 
                    type="text" 
                    v-model="searchQuery"
                    placeholder="Cari artikel..." 
                    class="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div class="absolute left-3 top-3 text-gray-400">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Categories -->
        <div class="mb-6 overflow-x-auto">
            <div class="flex space-x-2 pb-2">
                <button 
                    @click="selectedCategory = null" 
                    :class="[
                        'px-4 py-2 rounded-full text-sm whitespace-nowrap',
                        selectedCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    ]"
                >
                    Semua
                </button>
                <button 
                    v-for="category in categories" 
                    :key="category.id"
                    @click="selectedCategory = category.id"
                    :class="[
                        'px-4 py-2 rounded-full text-sm whitespace-nowrap',
                        selectedCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                    ]"
                >
                    {{ category.name }}
                </button>
            </div>
        </div>

        <!-- Featured Article -->
        <div v-if="featuredArticle" class="mb-6">
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="h-48 bg-gray-200">
                    <img 
                        :src="featuredArticle.imageUrl" 
                        :alt="featuredArticle.title"
                        class="w-full h-full object-cover"
                    />
                </div>
                <div class="p-4">
                    <div class="flex items-center mb-2">
                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {{ getCategoryName(featuredArticle.categoryId) }}
                        </span>
                        <span class="ml-2 text-xs text-gray-500">
                            {{ formatDate(featuredArticle.date) }}
                        </span>
                    </div>
                    <h2 class="text-xl font-bold mb-2">{{ featuredArticle.title }}</h2>
                    <p class="text-gray-600 mb-3">{{ featuredArticle.excerpt }}</p>
                    <NuxtLink 
                        :to="`/blog/${featuredArticle.id}`" 
                        class="text-blue-600 font-medium"
                    >
                        Baca Selengkapnya
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Article List -->
        <div class="mb-6">
            <h3 class="text-lg font-semibold mb-3">Artikel Terbaru</h3>
            <div v-if="filteredArticles.length > 0" class="space-y-4">
                <div 
                    v-for="article in filteredArticles" 
                    :key="article.id"
                    class="bg-white p-3 rounded-lg shadow flex items-start space-x-3"
                >
                    <div class="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0">
                        <img 
                            :src="article.imageUrl" 
                            :alt="article.title"
                            class="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center mb-1">
                            <span class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                {{ getCategoryName(article.categoryId) }}
                            </span>
                            <span class="ml-2 text-xs text-gray-500">
                                {{ formatDate(article.date) }}
                            </span>
                        </div>
                        <h4 class="font-medium">{{ article.title }}</h4>
                        <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ article.excerpt }}</p>
                        <NuxtLink 
                            :to="`/blog/${article.id}`" 
                            class="text-sm text-blue-600 mt-1 inline-block"
                        >
                            Baca selengkapnya
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div v-else class="bg-white p-6 rounded-lg shadow text-center">
                <p class="text-gray-500">Tidak ada artikel yang ditemukan.</p>
            </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreArticles" class="text-center mb-6">
            <button 
                @click="loadMoreArticles" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Muat Lebih Banyak
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Search
const searchQuery = ref('');

// Categories
const selectedCategory = ref(null);
const categories = ref([
    { id: 1, name: 'Aqidah' },
    { id: 2, name: 'Fiqih' },
    { id: 3, name: 'Akhlak' },
    { id: 4, name: 'Sirah' },
    { id: 5, name: 'Kajian' }
]);

// Article data (mock data for now)
const articles = ref([
    {
        id: 1,
        title: 'Pentingnya Salat Lima Waktu',
        excerpt: 'Salat lima waktu merupakan kewajiban bagi setiap muslim yang baligh dan berakal. Artikel ini menjelaskan keutamaan salat lima waktu dan hikmah di baliknya.',
        content: 'Lorem ipsum dolor sit amet...',
        categoryId: 2,
        date: '2025-03-26',
        imageUrl: '/images/salat.jpg',
        featured: true
    },
    {
        id: 2,
        title: 'Keutamaan Membaca Al-Kahfi di Hari Jumat',
        excerpt: 'Membaca surah Al-Kahfi di hari Jumat memiliki banyak keutamaan berdasarkan hadits Nabi Muhammad SAW.',
        content: 'Lorem ipsum dolor sit amet...',
        categoryId: 2,
        date: '2025-03-22',
        imageUrl: '/images/quran.jpg',
        featured: false
    },
    {
        id: 3,
        title: 'Adab Berpakaian dalam Islam',
        excerpt: 'Islam mengajarkan adab berpakaian yang baik sebagai bagian dari syariat dan akhlak seorang muslim.',
        content: 'Lorem ipsum dolor sit amet...',
        categoryId: 3,
        date: '2025-03-20',
        imageUrl: '/images/adab.jpg',
        featured: false
    },
    {
        id: 4,
        title: 'Kisah Sahabat Nabi: Abu Bakar As-Siddiq',
        excerpt: 'Mengenal lebih dekat sosok Abu Bakar As-Siddiq, sahabat terdekat dan khalifah pertama setelah Rasulullah SAW.',
        content: 'Lorem ipsum dolor sit amet...',
        categoryId: 4,
        date: '2025-03-18',
        imageUrl: '/images/sahabat.jpg',
        featured: false
    },
    {
        id: 5,
        title: 'Memahami Konsep Tauhid dalam Islam',
        excerpt: 'Tauhid adalah inti dari ajaran Islam. Artikel ini menjelaskan konsep tauhid dan penerapannya dalam kehidupan sehari-hari.',
        content: 'Lorem ipsum dolor sit amet...',
        categoryId: 1,
        date: '2025-03-15',
        imageUrl: '/images/tauhid.jpg',
        featured: false
    },
    {
        id: 6,
        title: 'Fenomena Halal Bihalal dalam Budaya Indonesia',
        excerpt: 'Halal bihalal telah menjadi tradisi budaya Indonesia yang dilakukan setelah Idul Fitri. Bagaimana pandangan Islam terhadap tradisi ini?',
        content: 'Lorem ipsum dolor sit amet...',
        categoryId: 5,
        date: '2025-03-10',
        imageUrl: '/images/halal-bihalal.jpg',
        featured: false
    }
]);

// Pagination
const articlesPerPage = 4;
const currentPage = ref(1);

// Featured article
const featuredArticle = computed(() => {
    return articles.value.find(article => article.featured);
});

// Filtering articles based on search and category
const filteredArticles = computed(() => {
    let filtered = articles.value;
    
    // Remove featured article from the list
    filtered = filtered.filter(article => !article.featured);
    
    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(article => 
            article.title.toLowerCase().includes(query) || 
            article.excerpt.toLowerCase().includes(query)
        );
    }
    
    // Filter by category
    if (selectedCategory.value) {
        filtered = filtered.filter(article => article.categoryId === selectedCategory.value);
    }
    
    // Return only current page articles
    return filtered.slice(0, currentPage.value * articlesPerPage);
});

const hasMoreArticles = computed(() => {
    const totalFilteredCount = articles.value
        .filter(article => !article.featured)
        .filter(article => {
            // Filter by search query
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase();
                return article.title.toLowerCase().includes(query) || 
                       article.excerpt.toLowerCase().includes(query);
            }
            return true;
        })
        .filter(article => {
            // Filter by category
            if (selectedCategory.value) {
                return article.categoryId === selectedCategory.value;
            }
            return true;
        }).length;
    
    return filteredArticles.value.length < totalFilteredCount;
});

// Load more articles
const loadMoreArticles = () => {
    currentPage.value++;
};

// Helper functions
const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId);
    return category ? category.name : 'Umum';
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>