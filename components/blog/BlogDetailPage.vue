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
                    :src="article.imageUrl" 
                    :alt="article.title"
                    class="w-full h-full object-cover"
                />
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
                <div class="prose prose-blue max-w-none">
                    <p>{{ article.content }}</p>
                    
                    <!-- Extended content for demo purposes -->
                    <h2>Keutamaan dalam Islam</h2>
                    <p>
                        Islam memberikan perhatian yang besar terhadap pentingnya melaksanakan ibadah dengan baik dan benar.
                        Hal ini sejalan dengan firman Allah SWT dalam Al-Quran dan hadits-hadits Nabi Muhammad SAW.
                    </p>
                    
                    <blockquote>
                        "Sesungguhnya shalat itu mencegah dari (perbuatan) keji dan mungkar." (QS. Al-Ankabut: 45)
                    </blockquote>
                    
                    <h2>Manfaat untuk Kehidupan</h2>
                    <p>
                        Selain keutamaan spiritual, ibadah dalam Islam juga memiliki banyak manfaat untuk kehidupan sehari-hari,
                        di antaranya:
                    </p>
                    
                    <ul>
                        <li>Meningkatkan kedisiplinan dan manajemen waktu</li>
                        <li>Menjaga kesehatan fisik dan mental</li>
                        <li>Memperkuat hubungan sosial dengan sesama muslim</li>
                        <li>Meningkatkan kualitas hidup secara keseluruhan</li>
                    </ul>
                    
                    <h2>Kesimpulan</h2>
                    <p>
                        Dengan memahami dan mengamalkan ajaran Islam dengan baik, seorang muslim dapat meraih
                        kebahagiaan di dunia dan akhirat. Oleh karena itu, penting bagi setiap muslim untuk terus
                        memperdalam pengetahuan agamanya dan mengamalkannya dalam kehidupan sehari-hari.
                    </p>
                </div>
            </div>
        </div>
        
        <!-- Loading State -->
        <div v-else class="bg-white p-6 rounded-lg shadow text-center">
            <p class="text-gray-500">Memuat artikel...</p>
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
                            :src="relatedArticle.imageUrl" 
                            :alt="relatedArticle.title"
                            class="w-full h-full object-cover rounded-md"
                        />
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
                <button class="p-2 bg-blue-500 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </button>
                <button class="p-2 bg-blue-400 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                </button>
                <button class="p-2 bg-green-500 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </button>
                <button class="p-2 bg-green-600 text-white rounded-lg">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Comments Section -->
        <div v-if="article" class="bg-white p-4 rounded-lg shadow mb-6">
            <h3 class="text-lg font-semibold mb-3">Komentar (3)</h3>
            
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
                        <div class="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div class="ml-3 flex-1">
                            <div class="flex items-center justify-between">
                                <h4 class="font-medium">{{ comment.author }}</h4>
                                <span class="text-xs text-gray-500">{{ comment.date }}</span>
                            </div>
                            <p class="text-gray-800 mt-1">{{ comment.text }}</p>
                            <button class="text-xs text-blue-600 mt-1">Balas</button>
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

const route = useRoute();
const articleId = computed(() => Number(route.params.id));

// Mock comments data
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

// Comment form
const commentText = ref('');

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

// Mock article data
const articles = ref([
    {
        id: 1,
        title: 'Pentingnya Salat Lima Waktu',
        excerpt: 'Salat lima waktu merupakan kewajiban bagi setiap muslim yang baligh dan berakal. Artikel ini menjelaskan keutamaan salat lima waktu dan hikmah di baliknya.',
        content: 'Salat lima waktu merupakan kewajiban bagi setiap muslim yang baligh dan berakal. Sebagai salah satu rukun Islam, salat memiliki kedudukan yang sangat penting dalam ajaran Islam. Rasulullah SAW bersabda, "Yang pertama kali dihisab dari seorang hamba pada hari kiamat adalah salatnya. Jika salatnya baik, maka baik pula seluruh amalnya. Dan jika salatnya rusak, maka rusak pula seluruh amalnya."',
        categoryId: 2,
        date: '2025-03-26',
        imageUrl: '/images/salat.jpg',
        featured: true
    },
    {
        id: 2,
        title: 'Keutamaan Membaca Al-Kahfi di Hari Jumat',
        excerpt: 'Membaca surah Al-Kahfi di hari Jumat memiliki banyak keutamaan berdasarkan hadits Nabi Muhammad SAW.',
        content: 'Membaca surah Al-Kahfi di hari Jumat memiliki banyak keutamaan berdasarkan hadits Nabi Muhammad SAW. Salah satu keutamaannya adalah mendapatkan cahaya di antara dua Jumat. Hal ini berdasarkan hadits yang diriwayatkan oleh Al-Baihaqi, bahwa Nabi Muhammad SAW bersabda: "Barangsiapa membaca surah Al-Kahfi pada hari Jumat, maka Allah akan meneranginya dengan cahaya di antara dua Jumat."',
        categoryId: 2,
        date: '2025-03-22',
        imageUrl: '/images/quran.jpg',
        featured: false
    },
    {
        id: 3,
        title: 'Adab Berpakaian dalam Islam',
        excerpt: 'Islam mengajarkan adab berpakaian yang baik sebagai bagian dari syariat dan akhlak seorang muslim.',
        content: 'Islam mengajarkan adab berpakaian yang baik sebagai bagian dari syariat dan akhlak seorang muslim. Pakaian dalam Islam bukan hanya sekedar penutup tubuh, tetapi juga sebagai identitas dan kehormatan. Allah SWT berfirman dalam Al-Quran surah Al-A\'raf ayat 26: "Hai anak Adam, sesungguhnya Kami telah menurunkan kepadamu pakaian untuk menutup auratmu dan pakaian indah untuk perhiasan. Dan pakaian takwa itulah yang paling baik."',
        categoryId: 3,
        date: '2025-03-20',
        imageUrl: '/images/adab.jpg',
        featured: false
    },
    {
        id: 4,
        title: 'Kisah Sahabat Nabi: Abu Bakar As-Siddiq',
        excerpt: 'Mengenal lebih dekat sosok Abu Bakar As-Siddiq, sahabat terdekat dan khalifah pertama setelah Rasulullah SAW.',
        content: 'Abu Bakar As-Siddiq adalah sahabat terdekat Nabi Muhammad SAW dan khalifah pertama dalam Islam. Nama aslinya adalah Abdullah bin Abi Quhafah. Beliau mendapat gelar As-Siddiq (yang membenarkan) karena beliaulah orang pertama yang membenarkan peristiwa Isra\' Mi\'raj Nabi Muhammad SAW. Abu Bakar dikenal dengan kedermawanan dan kecerdasannya dalam memimpin umat Islam setelah wafatnya Rasulullah SAW.',
        categoryId: 4,
        date: '2025-03-18',
        imageUrl: '/images/sahabat.jpg',
        featured: false
    },
    {
        id: 5,
        title: 'Memahami Konsep Tauhid dalam Islam',
        excerpt: 'Tauhid adalah inti dari ajaran Islam. Artikel ini menjelaskan konsep tauhid dan penerapannya dalam kehidupan sehari-hari.',
        content: 'Tauhid adalah konsep keesaan Allah SWT yang menjadi inti dari ajaran Islam. Tauhid terbagi menjadi tiga kategori: Tauhid Rububiyah (mengakui bahwa Allah adalah satu-satunya Pencipta dan Pemelihara alam semesta), Tauhid Uluhiyah (meyakini bahwa hanya Allah yang berhak disembah), dan Tauhid Asma\' wa Sifat (meyakini nama-nama dan sifat-sifat Allah sebagaimana disebutkan dalam Al-Quran dan Sunnah).',
        categoryId: 1,
        date: '2025-03-15',
        imageUrl: '/images/tauhid.jpg',
        featured: false
    },
    {
        id: 6,
        title: 'Fenomena Halal Bihalal dalam Budaya Indonesia',
        excerpt: 'Halal bihalal telah menjadi tradisi budaya Indonesia yang dilakukan setelah Idul Fitri. Bagaimana pandangan Islam terhadap tradisi ini?',
        content: 'Halal bihalal adalah tradisi silaturahmi dan saling memaafkan yang dilakukan oleh masyarakat Indonesia setelah merayakan Idul Fitri. Istilah ini merupakan gabungan dari kata halal dan bahil dari bahasa Arab. Meskipun tidak ada dalil khusus tentang halal bihalal, tradisi ini sejalan dengan ajaran Islam tentang silaturahmi dan saling memaafkan, sebagaimana sabda Rasulullah SAW: "Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia menyambung silaturahmi."',
        categoryId: 5,
        date: '2025-03-10',
        imageUrl: '/images/halal-bihalal.jpg',
        featured: false
    }
]);

// Get current article
const article = computed(() => {
    return articles.value.find(article => article.id === articleId.value);
});

// Get related articles (same category, excluding current article)
const relatedArticles = computed(() => {
    if (!article.value) return [];
    
    return articles.value
        .filter(a => a.categoryId === article.value.categoryId && a.id !== article.value.id)
        .slice(0, 2);
});

// Categories
const categories = ref([
    { id: 1, name: 'Aqidah' },
    { id: 2, name: 'Fiqih' },
    { id: 3, name: 'Akhlak' },
    { id: 4, name: 'Sirah' },
    { id: 5, name: 'Kajian' }
]);

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

.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>