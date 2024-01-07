<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/users';
import Cards from './Cards.vue';
import LoginMessage from './LoginMessage.vue';
import Container from './Container.vue';

const userStore = useUserStore()
const { user, loadingUser } = storeToRefs(userStore)

</script>

<template>
    <Container>
        <div v-if="!loadingUser">
            <Cards v-if="user" />
            <LoginMessage v-else />
        </div>
        <div v-else class="timeline-spinner">
            <ASpinn />
        </div>
    </Container>
</template>

<style>
.timeline-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
}

.timeline-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90vh;
}
</style>