<template>
  <div class="login-page">
    <div class="form">
      <form class="login-form" @submit.prevent="login">
        <input v-model="email" type="email" placeholder="email" required />
        <input v-model="password" type="password" placeholder="password" required />
        <button type="submit">Login</button>
        <p class="message">
          Not registered? <a href="#">Create an account</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import api from 'app/utils/Api';

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async  login() {

  try {
    const response = await api.post("/api/login", {
      email: this.email,
      password: this.password,
    });
    console.log("Sucesso:", response);

    const token = response.data.data.token;
    const id = response.data.data.user.id;
     localStorage.setItem("user_id", id);

    // Salve o token no localStorage
    localStorage.setItem("auth_token", token);

    // Redirecione para o dashboard
    this.$router.push("/dashboard");
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro no login.");
  }
},

  },
  mounted() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_id");
},
};


</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Roboto:300);

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
