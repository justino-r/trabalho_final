import { defineStore, acceptHMRUpdate } from 'pinia';

export const useLavandariaStore = defineStore('lavandaria', {
  state: () => ({
    fatura:{
      data_levantamento: "",
      metodo_pagamento: "",
      cliente_id: null,
      cliente: {
        nome: '',
        contacto: '',
      },
      funcionario_id: null,
      pecas: [],
    }

  }),

  getters: {

  },

  actions: {
    fatura_fetch() {

    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLavandariaStore, import.meta.hot));
}
