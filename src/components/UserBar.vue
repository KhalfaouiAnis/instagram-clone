<script setup>
import { useUserStore } from '@/stores/users';
import UploadPhotoModal from './UploadPhotoModal.vue';
import { useRoute } from "vue-router"
import { storeToRefs } from 'pinia';
import { supabase } from '@/supabase';

const userStore = useUserStore()

const { user } = storeToRefs(userStore)
const { params: { username: profileUsername } } = useRoute()
const { addNewPost, updateIsFollowing, isFollowing, userInfo, ...rest } = defineProps(["updateIsFollowing", "addNewPost", 'user', 'userInfo', 'isFollowing'])

const followUser = async () => {
    updateIsFollowing(true)

    await supabase.from("followers_following").insert({
        follower_id: user.value.id,
        following_id: rest.user.id
    })
}

const unfollowUser = async () => {
    updateIsFollowing(false)

    await supabase.from("followers_following").delete()
        .eq("follower_id", user.value.id)
        .eq("following_id", rest.user.value.id)
}

</script>

<template>
    <div class="userbar-container" v-if="user">
        <div class="top-content">
            <!-- <ATypographyTitle :level="2">{{ rest.user.username }}</ATypographyTitle> -->
            <div v-if="user">
                <UploadPhotoModal v-if="profileUsername === user?.username" :addNewPost="addNewPost" />
                <div v-else>
                    <AButton v-if="!isFollowing" @click="followUser">
                        Follow
                    </AButton>
                    <AButton v-else @click="unfollowUser">
                        Following
                    </AButton>
                </div>
            </div>
        </div>
        <div class="bottom-content">
            <ATypographyTitle :level="5">{{ userInfo.posts }} posts</ATypographyTitle>
            <ATypographyTitle :level="5">{{ userInfo.followers }} followers</ATypographyTitle>
            <ATypographyTitle :level="5">{{ userInfo.following }} following</ATypographyTitle>
        </div>
    </div>
    <div v-else class="userbar-container">
        <div class="top-content">
            <ATypographyTitle :level="2">User not found</ATypographyTitle>
        </div>
    </div>
</template>

<style scoped>
.userbar-container {
    padding-bottom: 75px;
}

.top-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bottom-content {
    display: flex;
    align-items: center;

}

.bottom-content h5 {
    margin: 0 !important;
    padding: 0;
    margin-right: 30px !important;
    align-items: center;
}
</style>