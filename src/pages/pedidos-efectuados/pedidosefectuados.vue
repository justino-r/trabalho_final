<template>
    <q-page class="q-pa-md">
      <div class="text-h5 text-primary q-mb-md">Lista de Todos os Pedidos Efetuados</div>
  
      <q-list bordered separator>
        <q-item v-for="pedido in pedidos" :key="pedido.id" class="q-pa-sm bg-grey-1 rounded-borders">
          <q-item-section>
            <div><strong>Cliente:</strong> {{ pedido.cliente }}</div>
            <div><strong>Peça:</strong> {{ pedido.peca }}</div>
            <div><strong>Quantidade:</strong> {{ pedido.quantidade }}</div>
            <div><strong>Valor Unitário:</strong> {{ formatCurrency(pedido.valorUnitario) }}</div>
            <div><strong>Valor Total:</strong> {{ formatCurrency(pedido.valorTotal) }}</div>
            <div><strong>Data do Pedido:</strong> {{ pedido.data }}</div>
            <div><strong>Estado:</strong>
              <q-badge :color="pedido.estado === 'Confirmado' ? 'green' : 'orange'" class="q-ml-sm">
                {{ pedido.estado }}
              </q-badge>
            </div>
          </q-item-section>
  
          <q-item-section side>
            <q-btn 
              label="Editar" 
              color="primary" 
              flat 
              icon="edit"
              @click="editarPedido(pedido.id)"
              :disable="pedido.estado === 'Confirmado'" 
            />
          </q-item-section>
        </q-item>
      </q-list>
  
      <!-- Modal de edição -->
      <q-dialog v-model="modalEditar" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h6">Editar Pedido</div>
          </q-card-section>
  
          <q-card-section>
            <q-input v-model="pedidoSelecionado.peca" label="Peça" />
            <q-input v-model.number="pedidoSelecionado.quantidade" label="Quantidade" type="number" @input="calcularValorTotal" />
            <q-input v-model.number="pedidoSelecionado.valorUnitario" label="Valor Unitário" type="number" @input="calcularValorTotal" />
            <div><strong>Valor Total:</strong> {{ formatCurrency(pedidoSelecionado.valorTotal) }}</div>
          </q-card-section>
  
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" v-close-popup />
            <q-btn flat label="Salvar" color="primary" @click="salvarEdicao" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const pedidos = ref([
    {
      id: 1,
      cliente: 'Ana João',
      peca: 'Camisa',
      quantidade: 2,
      valorUnitario: 15, // Adicionando valor unitário
      valorTotal: 30, // Calculado como quantidade * valor unitário
      data: '2025-04-01',
      estado: 'Confirmado'
    },
    {
      id: 2,
      cliente: 'Carlos Pedro',
      peca: 'Calça',
      quantidade: 1,
      valorUnitario: 20,
      valorTotal: 20,
      data: '2025-04-02',
      estado: 'Pendente'
    },
    {
      id: 3,
      cliente: 'Sara Pinto',
      peca: 'Vestido',
      quantidade: 3,
      valorUnitario: 25,
      valorTotal: 75,
      data: '2025-04-03',
      estado: 'Pendente'
    }
  ])
  
  const modalEditar = ref(false)
  const pedidoSelecionado = ref({})
  
  function editarPedido(id) {
    const pedido = pedidos.value.find(p => p.id === id)
    pedidoSelecionado.value = { ...pedido }
    modalEditar.value = true
  }
  
  function salvarEdicao() {
    const index = pedidos.value.findIndex(p => p.id === pedidoSelecionado.value.id)
    if (index !== -1) {
      pedidos.value[index] = { ...pedidoSelecionado.value }
    }
    modalEditar.value = false
  }
  
  function calcularValorTotal() {
    pedidoSelecionado.value.valorTotal = pedidoSelecionado.value.quantidade * pedidoSelecionado.value.valorUnitario
  }
  
  function formatCurrency(value) {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
  }).format(value)
}

  </script>
  
  <style scoped>
  .q-item {
    transition: box-shadow 0.3s;
  }
  .q-item:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>
  