<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { supabase } from '@/supabase';
import { useUserStore } from '@/stores/users';
import Card from './Card.vue';
import Observer from './Observer.vue';

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const posts = ref([])
const ownerIds = ref([])
const lastCardIndex = ref(2)
const reachedEnd = ref(false)

const fetchData = async () => {
    const { data: followings } = await supabase.
        from("followers_following")
        .select("following_id")
        .eq("follower_id", user.value.id)

    ownerIds.value = followings.map(f => f.following_id)

    const { data } = await supabase
        .from("posts")
        .select("*")
        .in("owner_id", ownerIds)
        .range(0, lastCardIndex.value)
        .order("created_at", { ascending: false })
    posts.value = data
}

const fetchNextSet = async () => {
    if (!reachedEnd.value) {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .in("owner_id", ownerIds)
            .range(lastCardIndex.value + 1, lastCardIndex.value + 3)
            .order("created_at", { ascending: false })

        posts.value.concat(data)

        lastCardIndex.value = lastCardIndex.value + 3

        if (data.length === 0) {
            reachedEnd.value = true
        }
    }
}

onMounted(() => fetchData()),

</script>

<template>
    <div class="timeline-container">
        <Card v-for="post in posts" :key="post.id" :card="post" />
        <Observer v-if="posts.length" @intersect="fetchNextSet" />
    </div>
</template>