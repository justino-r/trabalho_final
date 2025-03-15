<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section class="row justify-between items-center">
        <div class="text-h5 text-primary">Lista de Facturas</div>
        <q-btn color="positive" label="Nova Factura" @click="novaFactura" />
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="facturas"
          :columns="columns"
          row-key="id"
          separator="cell"
          dense
        >
          <template v-slot:body-cell-acoes="props">
            <q-td :props="props">
              <q-btn
                color="primary"
                label="Ver Detalhes"
                @click="verDetalhes(props.row)"
                dense
                class="q-mr-sm"
              />
              <q-btn
                color="secondary"
                label="Imprimir"
                @click="imprimirFactura(props.row)"
                dense
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from 'app/utils/Api';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

const facturas = ref([]);

const columns = [
  { name: 'id', required: true, label: 'ID', align: 'left', field: row => row.id, sortable: true },
  { name: 'cliente', label: 'Cliente', align: 'left', field: row => row.cliente?.nome || 'N/A', sortable: true },
  { name: 'total', label: 'Total (MZN)', align: 'left', field:  row => calcularTotalPecas(row.facturapecas), sortable: true },
  { name: 'data', label: 'Data de Levantamento', align: 'left', field: row => row.data_levantamento, sortable: true },
  { name: 'acoes', label: 'Ações', align: 'center' }
];


function calcularTotalPecas(facturapecas) {
  if (!facturapecas || !Array.isArray(facturapecas)) return 0;
  return facturapecas.reduce((total, peca) => total + peca.total, 0);
}

async function fetchFacturas() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await api.get('/api/invoices', {
      headers: { Authorization: `Bearer ${token}` },
    });
    facturas.value = response.data?.data || [];
  } catch (error) {
    console.error('Erro ao buscar facturas:', error);
    $q.notify({ type: 'negative', message: 'Erro ao carregar facturas!' });
  }
}

function verDetalhes(factura) {
  router.push(`/faturas/${factura.id}`);
}

function imprimirFactura(factura) {
  router.push(`/faturas/imprimir/${factura.id}`);
  // window.print(); // Simples abordagem para imprimir a página
}

function novaFactura() {
  router.push('/faturas/criar');
}

onMounted(() => {
  fetchFacturas();
});
</script>
