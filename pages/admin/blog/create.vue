<template>
    <div>
      <BlogForm :is-edit="false" />
    </div>
</template>

<script setup>
  definePageMeta({
    layout: 'admin'
  });
  
  import BlogForm from '~/components/admin/BlogForm.vue';
</script>