<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h5 text-primary">Nova factura</div>
      </q-card-section>

      <!-- Formulário de Cliente -->
      <q-card-section class="row q-gutter-md">
        <q-select filled label="Pesquisar Cliente" v-model="clienteSelecionado" :options="clientes" option-label="nome"
          option-value="id" use-input input-debounce="500" @filter="buscarClientes" emit-value map-options
          class="col" />
        <!-- Botão Adicionar Cliente -->
        <q-btn label="Adicionar Cliente" color="primary" @click="navegarParaAdicionarCliente" class="q-mt-none"
          style="margin-left: 10px;" />
      </q-card-section>

      <!-- Formulário de Factura -->
      <q-card-section class="row q-gutter-md">
        <q-input filled label="Método de Pagamento" v-model="metodoPagamento" class="col" />
        <q-input filled label="Data de Levantamento" v-model="dataLevantamento" type="date" class="col" />
      </q-card-section>

      <!-- Seleção de Peças -->
      <q-card-section>
        <div class="text-primary text-subtitle1">Selecionar peças</div>
      </q-card-section>

      <q-card-section class="row">
        <!-- SELECIONAR SERVIÇO -->
        <q-card class="col-6 q-pa-md">
          <div class="text-primary text-bold">Selecionar Serviço</div>
          <q-select filled label="Selecionar Serviço" :options="servicos" option-label="nome"
            v-model="servicoSelecionado" @update:model-value="atualizarPecas" class="q-mt-md" />

          <!-- LISTA DAS PEÇAS DO SERVIÇO SELECIONADO -->
          <q-list bordered separator class="q-mt-md">
            <q-item v-for="(peca, index) in pecas" :key="index" clickable @click="selecionarPeca(peca)">
              <q-item-section>
                {{ peca.tipo_peca.nome }} - {{ peca.tipo_peca.descricao }}
                ({{ peca.preco }} MZN)
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <!-- PEÇAS SELECIONADAS -->
        <q-card class="col-6 q-pa-md">
          <div class="text-primary text-bold">Selecionados</div>
          <q-list bordered separator class="q-mt-md">
            <q-item v-for="(item, index) in selecionados" :key="index">
              <q-item-section>
                {{ item.tipo_peca.nome }} - {{ item.tipo_peca.descricao }}
                ({{ item.preco }} MZN)
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-card-section>

      <q-card-section class="q-mt-md">
        <q-card class="q-pa-md">
          <div class="text-primary text-bold">Resumo</div>
          <div>Total: {{ total }} MZN</div>
          <q-btn color="primary" label="Finalizar Factura" class="q-mt-md" @click="criarFactura" />
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from 'app/utils/Api';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'; // Importando o useRouter

const $q = useQuasar();
const router = useRouter(); // Instanciando o router

const clientes = ref([]);
const clienteSelecionado = ref(null);

const servicos = ref([]);
const servicoSelecionado = ref(null);
const pecas = ref([]);
const selecionados = ref([]);

const metodoPagamento = ref('Numerário');
const dataLevantamento = ref(new Date().toISOString().slice(0, 10));
const funcionarioId = 1; // Substituir pelo funcionário logado

const total = computed(() =>
  selecionados.value.reduce(
    (sum, peca) => sum + parseFloat(peca.preco),
    0
  ).toFixed(2)
);

async function fetchServicos() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await api.get('/api/services', {
      headers: { Authorization: `Bearer ${token}` },
    });
    servicos.value = response.data?.data || [];
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
  }
}

async function buscarClientes(val, update) {
  if (val === '') {
    update(() => {
      clientes.value = [];
    });
    return;
  }

  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const { data } = await api.get(`/api/customers?filter[nome]=${val}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    update(() => {
      clientes.value = data.data || [];
    });
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    update(() => {
      clientes.value = [];
    });
  }
}

function atualizarPecas() {
  pecas.value = servicoSelecionado.value?.pecas || [];
}

function selecionarPeca(peca) {
  selecionados.value.push(peca);
}

async function criarFactura() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const facturaPayload = {
      data_levantamento: dataLevantamento.value,
      metodo_pagamento: metodoPagamento.value,
      cliente_id: clienteSelecionado.value,
      funcionario_id: funcionarioId,
    };

    const { data } = await api.post('/api/facturas', facturaPayload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const facturaId = data.data.id;

    await Promise.all(
      selecionados.value.map((peca) =>
        api.post(
          '/api/factura-pecas',
          {
            factura_id: facturaId,
            peca_id: peca.id,
            preco: peca.preco,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )
    );

    $q.notify({
      type: 'positive',
      message: 'Factura criada com sucesso!',
    });

    // Reset
    clienteSelecionado.value = null;
    metodoPagamento.value = 'Numerário';
    dataLevantamento.value = new Date().toISOString().slice(0, 10);
    servicoSelecionado.value = null;
    pecas.value = [];
    selecionados.value = [];
  } catch (error) {
    console.error('Erro ao criar factura:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao criar factura!',
    });
  }
}

function navegarParaAdicionarCliente() {
  router.push('/clientes'); // Navega para a tela de cadastro de clientes
}

onMounted(() => {
  fetchServicos();
});
</script>
