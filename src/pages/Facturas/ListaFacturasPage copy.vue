<template>
  <q-page padding>
    <h3>Criar Fatura</h3>

    <!-- Selecionar Cliente -->
    <q-select v-model="fatura.cliente_id" :options="clientes" label="Selecionar Cliente" option-label="nome"
      option-value="id" outlined dense emit-value map-options placeholder="Escolha um cliente" class="q-mb-md" />
    <q-select v-model="fatura.funcionario_id" :options="funcionarios" label="Selecionar Funcionario" option-label="nome"
      option-value="id" outlined dense emit-value map-options placeholder="Escolha um Funcionario" class="q-mb-md" />

    <!-- Data de Levantamento -->
    <q-input v-model="fatura.data_levantamento" label="Data de Levantamento" type="date" outlined dense
      class="q-mb-md" />

    <!-- Tipo de Pagamento -->
    <q-select v-model="fatura.tipo_pagamento" :options="tiposPagamento" label="Tipo de Pagamento" outlined dense
      placeholder="Escolha o tipo de pagamento" class="q-mb-md" />

    <!-- Botão para Criar Fatura -->
    <q-btn label="Criar Fatura" color="green" class="full-width" @click="criarFatura" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "app/utils/Api";
import { Notify } from "quasar";

const clientes = ref([]);
const funcionarios = ref([]);
const pecas = ref([]);
const pecaSelecionada = ref(null);
const novaPeca = ref({ cor: "", quantidade: 1 });
const fatura = ref({
  cliente_id: null,
  funcionario_id: null,
  data_levantamento: "",
  tipo_pagamento: null,
  pecas: [],
});
const tiposPagamento = ref(["Numeerário", "POS"]);
const colunasPecas = [
  { name: "nome", label: "Peça", field: "nome", align: "left" },
  { name: "cor", label: "Cor", field: "cor", align: "left" },
  { name: "quantidade", label: "Quantidade", field: "quantidade", align: "center" },
  { name: "acao", label: "Ações", align: "center" },
];

async function fetchClientes() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado.");

    const response = await api.get("api/customers" , {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
      clientes.value = response.data.data;
    } else {
      clientes.value = [];
    }

  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
  }
}



async function fetchFuncionarios() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado.");

    const response = await api.get("api/employees", {
      headers: { Authorization: `Bearer ${token}` },
    });


    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
      funcionarios.value = response.data.data;
    } else {
      funcionarios.value = [];
    }

  } catch (error) {
    console.error("Erro ao Funcionarios:", error);
  }
}

async function criarFatura() {

  try {

    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Autentique-se, nao pode criar a fatura");
    const payload = {
      funcionario_id: fatura.value.funcionario_id,
      cliente_id: fatura.value.cliente_id,
      metodo_pagamento: fatura.value.tipo_pagamento,
      data_levantamento: fatura.value.data_levantamento

    }
    console.log(payload);
    const response = await api.post("api/invoices", payload, {
      headers: {Authorization: `Bearer ${token}`}
    });
    Notify.create({
      message: "Factura criada com criada",
      type: "positive",
      position: "top-right"

    })
    console.log("Peca criada com sucesso");
  } catch (error) {
    console.error("Erro ao criar fatura:", error);
  }
}

onMounted(() => {
  fetchClientes();
  fetchFuncionarios();
});
</script>

<style scoped>
.q-page {
  max-width: 800px;
  margin: auto;
}

.q-btn {
  margin-top: 10px;
}
</style>
