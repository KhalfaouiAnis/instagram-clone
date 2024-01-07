import { ref } from "vue";
import { defineStore } from "pinia";
import { supabase } from "../supabase";

export const useUserStore = defineStore("users", () => {
  const user = ref(null);
  const errorMessage = ref("");
  const loading = ref(false);
  const loadingUser = ref(false);

  const handleLogin = async (credentials) => {
    const { email, password } = credentials;

    if (password.length === 0) {
      return (errorMessage.value = "Password cannot be empty");
    }

    loading.value = true;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      email: existingUser.email,
      username: existingUser.username,
      id: existingUser.id,
    };
    loading.value = false;
    clearErrorMessage();
  };

  const clearErrorMessage = () => {
    errorMessage.value = "";
  };

  const handleSignup = async (credentials) => {
    const { username, email, password } = credentials;

    if (password.length < 6) {
      return (errorMessage.value = "Password too short");
    }

    if (username.length < 4) {
      return (errorMessage.value = "Username too short");
    }

    loading.value = true;

    // Check if user exists
    const { data: userWithUsername } = await supabase
      .from("users")
      .select()
      .eq("username", username)
      .single();

    if (userWithUsername) {
      loading.value = false;
      return (errorMessage.value = "User already in use");
    }

    errorMessage.value = "";

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      loading.value = false;
      return (errorMessage.value = error.message);
    }

    await supabase.from("users").insert({ username, email });

    const { data: newUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    user.value = {
      id: newUser.id,
      email,
      username,
    };

    loading.value = false;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    user.value = null;
  };

  const getUser = async () => {
    loadingUser.value = true;
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      loadingUser.value = false;
      return (user.value = null);
    }

    const { data: userWithEmail } = await supabase
      .from("users")
      .select()
      .eq("email", data.user.email)
      .single();

    user.value = {
      email: userWithEmail.email,
      username: userWithEmail.username,
      id: userWithEmail.id,
    };
    loadingUser.value = false;
  };

  return {
    user,
    errorMessage,
    loading,
    loadingUser,
    clearErrorMessage,
    handleLogin,
    handleSignup,
    handleLogout,
    getUser,
  };
});
