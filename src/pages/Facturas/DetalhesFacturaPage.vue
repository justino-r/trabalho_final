<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section class="row justify-between items-center">
        <div class="text-h5 text-primary">Detalhes da Factura</div>
        <q-btn color="primary" label="Voltar" @click="voltar" />
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              <q-item-label><strong>ID:</strong> {{ factura.id }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>Cliente:</strong> {{ factura.cliente?.nome || 'N/A' }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>Total (MZN):</strong> {{ factura.total_a_pagar }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>Data de Levantamento:</strong> {{ factura.data_levantamento }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label><strong>Total Peças (MZN):</strong> {{ calcularTotalPecas(factura.facturapecas) }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <div class="text-h6 text-primary">Peças</div>
        <q-table :rows="factura.facturapecas" :columns="pecasColumns" row-key="id" dense />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from 'app/utils/Api';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const factura = ref({ facturapecas: [] });

const pecasColumns = [
  { name: 'id', label: 'ID', field: row => row.id, sortable: true },
  { name: 'cor', label: 'Cor', field: row => row.cor, sortable: true },
  { name: 'quantidade', label: 'Quantidade', field: row => row.quantidade, sortable: true },
  { name: 'total', label: 'Total (MZN)', field: row => row.total, sortable: true }
];

async function fetchFactura() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await api.get(`/api/invoices/${route.params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    factura.value = response.data?.data;
  } catch (error) {
    console.error('Erro ao buscar factura:', error);
    $q.notify({ type: 'negative', message: 'Erro ao carregar detalhes da factura!' });
  }
}

function calcularTotalPecas(facturapecas) {
  if (!facturapecas || !Array.isArray(facturapecas)) return 0;
  return facturapecas.reduce((total, peca) => total + peca.total, 0);
}

function voltar() {
  router.push('/faturas');
}

onMounted(() => {
  fetchFactura();
});
</script>
