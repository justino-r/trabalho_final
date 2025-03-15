import { defineStore } from 'pinia';
import api from 'app/utils/Api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authUser: null,
    authToken: null,

  }),
  getters: {
    user: (state) => state.authUser,
    token: (state) => state.authToken,
    isAuthenticated: (state) => !!state.authToken, // Retorna true se o usuário estiver logado
  },
  actions: {
    async signIn({ email, password }) {
      try {
        const response = await api.post("/api/login", { email, password });
        // console.log("Login response", response.data);
        if(response.data.status == 200){

          this.authToken = response.data.data.token;
          this.authUser = response.data.data.user;


          localStorage.setItem("auth_token", this.authToken);
          localStorage.setItem("auth_user", JSON.stringify(this.authUser));
          return 200;
        }else{
          return 500;
        }
      } catch (error) {
        console.error("Erro no login:", error);
        // throw error;
        return 500;
      }
    },
    loadUserFromStorage() {
      const storedUser = localStorage.getItem("auth_user");
      const storedToken = localStorage.getItem("auth_token");

      if (storedUser && storedToken) {
        this.authUser = JSON.parse(storedUser);
        this.authToken = storedToken;
      }
    },
    signOut() {
      this.authUser = null;
      this.authToken = null;
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  }
});
