<script setup>

const { post } = defineProps(['post'])

const {VITE_BASE_PHOTO_URL} = import.meta.env

</script>

<template>
    <ACard hoverable style="width: 240px" class="card">
        <template #cover>
            <img alt="cover" :src="`${VITE_BASE_PHOTO_URL}${post.url}`" />
        </template>
        <ACardMeta :title="post.username">
            <template #description>
                {{ post.caption }}
            </template>
        </ACardMeta>
    </ACard>
</template>

<style scoped>
.card {
    margin-bottom: 20px;
}
</style>