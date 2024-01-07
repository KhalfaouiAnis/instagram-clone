<script setup>
import { ref } from "vue"
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router"
import Container from "@/components/Container.vue"
import AuthModal from "@/components/AuthModal.vue"
import { useUserStore } from "@/stores/users";

const userStore = useUserStore()

const { user, loadingUser } = storeToRefs(userStore)

const { push } = useRouter()
const searchUsername = ref("")

const onSearch = () => {
    if (searchUsername.value) {
        push(`/profile/${searchUsername.value}`)
        searchUsername.value = ""
    }
}

const goToUserProfile = () => {
    push(`/profile/${user.value.username}`)
}

const handleLogout = async () => {
    await userStore.handleLogout()
}

</script>

<template>
    <ALayoutHeader>
        <Container>
            <div class="nav-container">
                <div class="right-content">
                    <RouterLink to="/">Instagram</RouterLink>
                    <AInputSearch v-model:value="searchUsername" placeholder="username..." @search="onSearch" />

                </div>
                <div class="content" v-if="!loadingUser">
                    <div class="left-content" v-if="!user">
                        <AuthModal :isLogin="false" />
                        <AuthModal :isLogin="true" />
                    </div>
                    <div class="left-content" v-else>
                        <AButton @click="goToUserProfile" type="primary">
                            Profile
                        </AButton>
                        <AButton @click="handleLogout" type="primary">
                            Logout
                        </AButton>
                    </div>
                </div>

            </div>
        </Container>
    </ALayoutHeader>
</template>

<style scoped>
.nav-container {
    display: flex;
    justify-content: space-between;
}

.content {
    display: flex;
    align-items: center;
}

.right-content {
    display: flex;
    align-items: center;
}

.right-content a {
    margin-right: 10px;
}

.left-content {
    display: flex;
    align-items: center;
}

.left-content button {
    margin-left: 10px;
}
</style>