<script setup>
import { reactive, ref } from 'vue';
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/users"

const userStore = useUserStore()

const { user, errorMessage, loading } = storeToRefs(userStore)
const { isLogin } = defineProps(['isLogin'])
const visible = ref(false);

const userCredentials = reactive({
    email: "",
    username: "",
    password: ""
})

const showModal = () => {
    visible.value = true;
};

const clearInputs = () => {
    userCredentials.email = ""
    userCredentials.username = ""
    userCredentials.password = ""
}

const handleOk = async () => {
    if (isLogin) {
        await userStore.handleLogin(userCredentials)
    } else {
        await userStore.handleSignup(userCredentials)
    }
    if (user.value) {
        visible.value = false
        clearInputs()
    }
};

const handleCancel = () => {
    userStore.clearErrorMessage()
    visible.value = false
};

const title = isLogin ? 'Login' : 'Signup'

</script>

<template>
    <div>
        <AButton class="btn" type="primary" @click="showModal">{{ title }}</AButton>
        <AModal v-model:visible="visible" :title="title" @ok="handleOk">
            <template #footer>
                <AButton key="back" @click="handleCancel">Cancel</AButton>
                <AButton :disabled="loading" key="submit" type="primary" @click="handleOk">Submit</AButton>
            </template>
            <div v-if="!loading" class="input-container">
                <AInput class="input" v-if="!isLogin" v-model:value="userCredentials.username" placeholder="Username" />
                <AInput class="input" v-model:value="userCredentials.email" placeholder="Email" />
                <AInput class="input" v-model:value="userCredentials.password" placeholder="Password" type="password" />
            </div>
            <div v-else class="spinner">
                <ASpin />
            </div>
            <ATypographyText v-if="errorMessage" type="danger">
                {{ errorMessage }}
            </ATypographyText>
        </AModal>
    </div>
</template>

<style scoped>
.btn {
    margin-left: 10px;
}

.input {
    margin-top: 8px;
}

.input-container {
    height: 120px;
}

.spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
}
</style>