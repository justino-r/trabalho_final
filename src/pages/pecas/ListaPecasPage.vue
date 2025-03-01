<template>
  <q-page padding>
    <!-- Cabeçalho -->
    <div class="text-h4 text-center text-primary">Gestão de Peças</div>

    <!-- Barra de Pesquisa e Botão para Adicionar Peça -->
    <div class="row items-center q-mb-md">
      <q-input outlined dense debounce="300" v-model="search" placeholder="Procurar peças..." class="col-grow">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <!-- Botão para abrir o modal -->
      <q-btn class="q-ml-md" label="Adicionar Peça" color="primary" @click="openAddPecaDialog" />
    </div>

    <!-- Tabela de Peças -->
    <q-card>
      <q-card-section>
        <q-table   :rows="filteredPecas" :columns="columns" row-key="id" :pagination="pagination"
          :rows-per-page-options="[5, 10, 20]" bordered dense />
      </q-card-section>
    </q-card>

    <!-- Dialog de Adicionar Peça -->
    <q-dialog v-model="addPecaDialog">
      <q-card style="max-width: 900px">
        <q-card-section>
          <div class="text-h6">Adicionar Peça</div>
          <div class="text-caption">Preencha os dados abaixo</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Tipo de Peça -->
          <div>
            <label class="q-mb-sm">Tipo de Peça</label>
            <q-select
            v-if="tipoPecas.length > 0 "
             :options="tipoPecas"
              v-model="currentPeca.tipo_peca_id"
              label="Selecione o Tipo"
              outlined
              dense
              option-label="nome"
              option-value="id"
            />
            <p v-else class="else">Não ha tipo de peça</p>
          </div>

          <!-- Serviços (Dinâmicos) -->
          <div>
            <label class="q-mb-sm">Serviços</label>
            <div v-for="(servico, index) in currentPeca.servicos" :key="index" class="q-mb-sm">
              <q-select v-model="currentPeca.servico_id" :options="servicos" label="Selecionar Serviço" outlined
                dense option-label="nome" option-value="id" />
            </div>
            <q-btn flat dense label="Adicionar Serviço" color="primary" @click="addServico" />
          </div>

          <!-- Preço -->
          <q-input v-model.number="currentPeca.preco" label="Preço" outlined dense required type="number" step="0.01"
            class="q-mb-sm" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="positive" @click="savePeca" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from 'app/utils/Api';
import { Notify } from 'quasar';

const addPecaDialog = ref(false);
const currentPeca = ref({  descricao: '', servico_id: null, tipo_peca_id: '', preco: 0 });
const servicos = ref([]);
const tipoPecas = ref([]);
const pecas = ref([]);
const search = ref('');
const columns = ref([
  { name: 'nome', label: 'Nome', align: 'left', field: row => row.nome },
  { name: 'servico', label: 'Serviços', align: 'left', field: row => row.servicos.map(serv => serv.nome).join(', ') },
  { name: 'preco', label: 'Preço', align: 'right', field: row => row.preco },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center',
    format: () => '<q-btn flat dense icon="edit" color="primary" @click="editPeca(row)" /> <q-btn flat dense icon="delete" color="negative" @click="deletePeca(row)" />' },
]);

const pagination = ref({
  rowsPerPage: 10
});

const filteredPecas = computed(() =>
  pecas.value.filter(peca =>
    peca?.nome?.toLowerCase().includes(search.value?.toLowerCase() || '')
  )
);

const openAddPecaDialog = () => {
  addPecaDialog.value = true;
  currentPeca.value = { nome: '', descricao: '', servicos: [], tipo_peca_id: '', preco: 0 };
};

const editPeca = (row) => {
  currentPeca.value = { ...row };
  addPecaDialog.value = true;
};

const deletePeca = async (row) => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    await api.delete(`/api/items/${row.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    pecas.value = pecas.value.filter(p => p.id !== row.id);
  } catch (error) {
    console.error('Erro ao eliminar peça:', error);
  }
};

const addServico = () => {
  currentPeca.value.servicos.push(null);
};

const fetchServicos = async () => {
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
};

const fetchTiposPecas = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await api.get('/api/itemtypes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    tipoPecas.value = response.data?.data || [];
  } catch (error) {
    console.error('Erro ao buscar tipos de peças:', error);
  }
};

const fetchPecas = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const response = await api.get('/api/items', {
      headers: { Authorization: `Bearer ${token}` },
    });
    pecas.value = response.data?.data || [];
  } catch (error) {
    console.error('Erro ao buscar peças:', error);
  }
};

const savePeca = async () => {
  try {


    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Token de autenticação não encontrado.');

    const payload = {

      servico_id: currentPeca.value.servico_id.id,
      tipo_peca_id: currentPeca.value.tipo_peca_id.id,
      preco: currentPeca.value.preco,
    };
    console.log(payload)

    if (currentPeca.value.id) {
      await api.put(`/api/items/${currentPeca.value.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await api.post('/api/items', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    Notify.create({
      message: 'Peça salva com sucesso.',
      type: 'positive',
      position: 'top-right'
    });
    addPecaDialog.value = false;
    fetchPecas(); // Atualiza a lista de peças.
  } catch (error) {
    console.error('Erro ao salvar peça:', error);
    Notify.create({
      message: error.response?.data?.message || 'Erro ao salvar peça.',
      type: 'negative',
      position: 'top-right'
    });
  }
};


onMounted(() => {
  fetchServicos();
  fetchTiposPecas();
  fetchPecas();
});
</script>

<style scoped>
.text-primary {
  color: #1976d2;
}

.q-page {
  padding: 16px;
}

.q-card {
  margin-top: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.q-card-section {
  padding: 16px;
}

.q-table {
  margin-top: 16px;
}

.q-mb-sm {
  margin-bottom:10px;
}

else{
  margin-top: 10px;
}
  </style>
