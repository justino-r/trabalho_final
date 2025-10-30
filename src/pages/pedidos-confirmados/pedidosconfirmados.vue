<template>
  <q-page class="q-pa-md">
    <div class="text-h5 text-primary q-mb-md">Pedidos Confirmados</div>

    <q-list bordered separator>
      <q-item 
        v-for="pedido in pedidosConfirmados" 
        :key="pedido.id" 
        class="q-pa-sm bg-grey-2 rounded-borders"
      >
        <q-item-section>
          <div><strong>Cliente:</strong> {{ pedido.cliente }}</div>
          <div><strong>Peça:</strong> {{ pedido.peca }}</div>
          <div><strong>Quantidade:</strong> {{ pedido.quantidade }}</div>
          <div><strong>Data do Pedido:</strong> {{ pedido.data }}</div>
          <div>
            <strong>Estado:</strong>
            <q-badge color="green" class="q-ml-sm">{{ pedido.estado }}</q-badge>
          </div>
        </q-item-section>

        <!-- Área reservada para gerente -->
        <!--
        <q-item-section side>
          <q-btn flat color="red" icon="delete" label="Apagar" />
          <q-btn flat color="primary" icon="edit" label="Editar" />
        </q-item-section>
        -->
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const pedidosConfirmados = ref([
  {
    id: 1,
    cliente: 'Ana João',
    peca: 'Camisa',
    quantidade: 2,
    data: '2025-04-01',
    estado: 'Confirmado'
  },
  {
    id: 2,
    cliente: 'Carlos Pedro',
    peca: 'Calça',
    quantidade: 1,
    data: '2025-04-02',
    estado: 'Confirmado'
  }
])
</script>

<style scoped>
.q-item {
  transition: box-shadow 0.3s;
}
.q-item:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
</style>
