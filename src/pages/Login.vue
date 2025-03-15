<template>
  <div class="login-page">
    <div class="form">
      <form class="login-form" @submit.prevent="login">
        <input v-model="form.email" type="email" placeholder="Email" required />
        <input v-model="form.password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p class="message">
          Not registered? <a href="#">Create an account</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useAuthStore } from "src/stores/auth";
import { storeToRefs } from "pinia";
const auth = useAuthStore();


const form = ref({
  email: "",
  password: "",
});

const router = useRouter();



async function login() {
  try {
    auth.signIn(form.value)

    router.push("/dashboard");
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    Notify.create({
      type: "negative",
      message: "Falha no login. Verifique suas credenciais.",
    });
  }
}
onMounted(() => {
  auth.signOut();

});
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto:300");

.login-page {
  width: 360px;
  padding: 8% 0 0;
  margin: auto;
}

.form {
  position: relative;
  z-index: 1;
  background: #ffffff;
  max-width: 360px;
  margin: 0 auto 100px;
  padding: 45px;
  text-align: center;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
}

.form input {
  font-family: "Roboto", sans-serif;
  outline: 0;
  background: #f2f2f2;
  width: 100%;
  border: 0;
  margin: 0 0 15px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
}

.form button {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  outline: 0;
  background: var(--q-primary);
  width: 100%;
  border: 0;
  padding: 15px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.form button:hover,
.form button:active,
.form button:focus {
  background: var(--q-primary);
}

.form .message {
  margin: 15px 0 0;
  color: #b3b3b3;
  font-size: 12px;
}

.form .message a {
  color: var(--q-primary);
  text-decoration: none;
}

body {
  background: #ffffff;
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
