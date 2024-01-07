<script setup>
import { ref } from 'vue';
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/users"
import { supabase } from "../supabase"

const userStore = useUserStore()

const { user } = storeToRefs(userStore)

const { addNewPost } = defineProps(["addNewPost"])

const loading = ref(false);
const errorMessage = ref("");

const visible = ref(false);
const caption = ref("");
const file = ref(null);

let filePath

const showModal = () => {
    visible.value = true;
};

const handleOk = async () => {
    loading.value = true
    const fileName = new Date()

    if (file.value) {
        const { data, error } = await supabase.storage.from("images").upload("public/" + fileName, file.value)
        if (error) {
            loading.value = false
            errorMessage.value = "Unable to upload image"
            return
        }

        filePath = data.path
        await supabase.from("posts").insert({
            url: filePath,
            caption: caption.value,
            owner_id: user.value.id
        })

    }
    loading.value = false
    visible.value = false
    caption.value = ""

    addNewPost({
        url: filePath,
        caption: caption.value
    })
};

const handleCancel = () => {
    visible.value = false
};

const handleUploadChnage = (e) => {
    if (e.target.files[0]) {
        file.value = e.target.files[0]
    }
}

</script>

<template>
    <div>
        <AButton class="btn" type="primary" @click="showModal">Upload Photo</AButton>
        <AModal v-model:visible="visible" title="Upload Photo" @ok="handleOk">
            <div v-if="!loading">
                <input @change="handleUploadChnage" type="file" accept=".jpeg,.png">
                <AInput v-model:value="caption" :maxLength="50" placeholder="Caption..." />
                <ATypographyText v-if="errorMessage" type="danger">
                    {{ errorMessage }}
                </ATypographyText>
            </div>
            <div v-else class="spinner">
                <ASpin />
            </div>
        </AModal>
    </div>
</template>

<style scoped>
.input {
    margin-top: 10px;
}

.spinner {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>