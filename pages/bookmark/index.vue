<template>
    <div>
      <!-- Header -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold">Bookmark</h2>
        <p class="text-gray-600">Ayat dan artikel yang Anda tandai</p>
      </div>
  
      <!-- Quran Bookmarks Section -->
      <div class="mb-6">
        <BookmarkList />
      </div>
    </div>
</template>
  
<script setup>
    import BookmarkList from '~/components/quran/BookmarkList.vue';
</script>