<template>
  <div class="factura-container">
    <q-page class="q-pa-md">
      <q-card class="q-pa-md q-elevated">
        <!-- Cabeçalho -->
        <q-card-section class="row justify-between items-center bg-primary text-white rounded-borders q-pa-md">
          <div>
            <div class="text-h5"> <strong>Moz SQ Clean.</strong></div>
            <div class="text-caption">Av. Moçambique, 123 - Maputo | Tel: +258 84 123 4567</div>
          </div>
          <!-- <q-btn color="white" text-color="primary" label="Imprimir" @click="exportPdf" icon="print" /> -->
        </q-card-section>

        <q-separator />

        <!-- Informações da Fatura -->
        <q-card-section class="q-mt-md">
          <div class="row justify-between">
            <div>
              <div class="text-subtitle2"><strong>ID da Fatura:</strong> {{ factura.id }}</div>
              <div class="text-subtitle2"><strong>Data de Emissão:</strong> {{ formatarData(factura.data_levantamento) }}</div>
            </div>
            <div>
              <div class="text-subtitle2"><strong>Cliente:</strong> {{ factura.cliente?.nome || 'N/A' }}</div>
              <div class="text-subtitle2"><strong>Total (MZN): {{ calcularTotalPecas(factura.facturapecas) }}</strong> {{ factura.total_a_pagar }}</div>
            </div>
          </div>
        </q-card-section>

        <q-separator class="q-my-md" />

        <!-- Tabela de Peças -->
        <q-card-section>
          <div class="text-h6 text-primary">🛒 Itens da Fatura</div>
          <q-table dense :rows="factura.facturapecas" :columns="pecasColumns" row-key="id" bordered flat />
        </q-card-section>

        <!-- Total e Observações -->
        <q-separator class="q-my-md" />
        <q-card-section class="row justify-between">
          <div>
            <div class="text-bold text-h6">Total a Pagar: {{ calcularTotalPecas(factura.facturapecas) }}</div>
            <div class="text-h5 text-primary">{{ factura.total_a_pagar }} MZN</div>
          </div>
          <div>
            <div class="text-caption">Pagamento deve ser efetuado até a data de vencimento indicada.</div>
          </div>
        </q-card-section>

        <!-- Rodapé -->
        <q-card-section class="q-mt-md row justify-end">
          <!-- <q-btn color="negative" label="Voltar" @click="voltar" icon="arrow_back" /> -->
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script setup>
import { watch } from 'vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from 'app/utils/Api';
import { useQuasar } from 'quasar';
import html2pdf from 'html2pdf.js';

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

function voltar() {
  router.push('/faturas');
}

function formatarData(data) {
  if (!data) return 'N/A';
  const d = new Date(data);
  return d.toLocaleDateString('pt-PT');
}
function calcularTotalPecas(facturapecas) {
  if (!facturapecas || !Array.isArray(facturapecas)) return 0;
  return facturapecas.reduce((total, peca) => total + peca.total, 0);
}
function exportPdf() {
  html2pdf(document.querySelector('.factura-container'), {
    margin: 10,
    filename: `fatura_${factura.value.id}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  });
}
watch(
  () => factura.value.id,
  (newValue) => {
    if (newValue) {
      setTimeout(() => exportPdf(), 1000); // Aguarda para garantir renderização
    }
  }
);
onMounted(() => {
  fetchFactura();
});
</script>
