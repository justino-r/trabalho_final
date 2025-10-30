<template>
    <q-page class="q-pa-md">
      <div class="text-h5 text-primary q-mb-md">Consultar Estado da Roupa</div>
  
      <q-input
        v-model="termoBusca"
        label="Digite o número do telefone ou ID do pedido"
        outlined
        dense
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-btn flat icon="search" @click="consultarEstado" />
        </template>
      </q-input>
  
      <div v-if="resultados.length > 0">
        <q-list bordered separator>
          <q-item v-for="roupa in resultados" :key="roupa.id" class="bg-grey-2 q-pa-sm rounded-borders">
            <q-item-section>
              <div><strong>Peça:</strong> {{ roupa.peca }}</div>
              <div><strong>Estado:</strong>
                <q-badge :color="corEstado(roupa.estado)" class="q-ml-sm">{{ roupa.estado }}</q-badge>
              </div>
              <div><strong>Data de Entrada:</strong> {{ roupa.dataEntrada }}</div>
              <div><strong>Data Prevista de Entrega:</strong> {{ roupa.dataEntrega }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
  
      <div v-else-if="pesquisado">
        <q-banner class="bg-orange-1 text-orange-10 q-mt-md">
          Nenhuma roupa encontrada com esse número.
        </q-banner>
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const termoBusca = ref('')
  const pesquisado = ref(false)
  
  const roupas = ref([
    {
      id: 1,
      cliente: 'João',
      telefone: '840000000',
      peca: 'Camisa',
      estado: 'Em processo de lavagem',
      dataEntrada: '2025-04-01',
      dataEntrega: '2025-04-04',
      pedidoId: 'P001'
    },
    {
      id: 2,
      cliente: 'João',
      telefone: '840000000',
      peca: 'Calça',
      estado: 'Finalizada',
      dataEntrada: '2025-04-01',
      dataEntrega: '2025-04-04',
      pedidoId: 'P001'
    },
    {
      id: 3,
      cliente: 'Ana',
      telefone: '870000000',
      peca: 'Vestido',
      estado: 'Entregue',
      dataEntrada: '2025-03-28',
      dataEntrega: '2025-04-01',
      pedidoId: 'P002'
    }
  ])
  
  const resultados = ref([])
  
  function consultarEstado() {
    resultados.value = roupas.value.filter(
      roupa =>
        roupa.telefone.includes(termoBusca.value) ||
        roupa.pedidoId.toLowerCase().includes(termoBusca.value.toLowerCase())
    )
    pesquisado.value = true
  }
  
  function corEstado(estado) {
    switch (estado) {
      case 'Em espera':
        return 'grey'
      case 'Em processo de lavagem':
        return 'orange'
      case 'Finalizada':
        return 'blue'
      case 'Pronta para entrega':
        return 'green'
      case 'Entregue':
        return 'teal'
      default:
        return 'primary'
    }
  }
  </script>
  
  <style scoped>
  .q-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  </style>
  