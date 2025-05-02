<template>
    <div>
      <BlogForm :is-edit="true" />
    </div>
</template>

<script setup>
  definePageMeta({
    layout: 'admin'
  });
  
  import BlogForm from '~/components/admin/BlogForm.vue';
</script>