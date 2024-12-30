<template>
  <q-page padding>
    <!-- Cabeçalho -->
    <div class="text-h4 text-center text-primary">Gestão de Clientes</div>

    <!-- Tabela de Clientes -->
    <q-card>
      <q-card-section class="row items-center">
        <q-input
          outlined
          dense
          debounce="300"
          v-model="search"
          placeholder="Procurar clientes..."
          class="col-grow"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-md"
          color="primary"
          icon="add"
          label="Adicionar Cliente"
          @click="showAddClientModal"
        />
      </q-card-section>

      <q-separator />

      <q-table
        rows-per-page-options="[5, 10, 20]"
        :rows="filteredClientes"
        :columns="columns"
        row-key="id"
        class="q-mt-md"
        bordered
        dense
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn
              flat
              dense
              icon="edit"
              color="blue"
              aria-label="Editar"
              @click="editClient(props.row)"
            />
            <q-btn
              flat
              dense
              icon="delete"
              color="red"
              aria-label="Excluir"
              @click="deleteClient(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal para Adicionar Cliente -->
    <q-dialog v-model="addClientDialog">
      <q-card style="max-width: 500px">
        <q-card-section>
          <div class="text-h6">Adicionar Cliente</div>
          <div class="text-caption">Preencha os dados abaixo para adicionar um novo cliente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input
            v-model="newClient.nome"
            label="Nome"
            outlined
            dense
            required
            class="q-mb-sm"
          />
          <q-input
            v-model="newClient.contacto"
            label="Contato"
            outlined
            dense
            required
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="positive" @click="addClient" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Dados fictícios de clientes
const clientes = ref([
  { id: 1, nome: 'João Silva', contacto: '843456789' },
  { id: 2, nome: 'Maria Santos', contacto: '843123456' },
  { id: 3, nome: 'Carlos Almeida', contacto: '847654321' },
  { id: 4, nome: 'Ana Paula', contacto: '842369741' },
  { id: 5, nome: 'Pedro Rocha', contacto: '846789123' },
  { id: 6, nome: 'Lucas Pereira', contacto: '843215678' },
  { id: 7, nome: 'Isabela Gomes', contacto: '845678912' },
  { id: 8, nome: 'Rafael Costa', contacto: '847123456' },
  { id: 9, nome: 'Fernanda Lima', contacto: '846541236' },
  { id: 10, nome: 'Eduardo Moreira', contacto: '843654789' }
]);

// Configuração da tabela
const columns = [
  { name: 'nome', required: true, label: 'Nome', align: 'left', field: 'nome' },
  { name: 'contacto', label: 'Contato', align: 'left', field: 'contacto' },
  { name: 'actions', label: 'Ações', align: 'center', field: 'actions' }
];

const search = ref('');
const addClientDialog = ref(false);
const newClient = ref({ nome: '', contacto: '' });

// Filtrar clientes com base no campo de pesquisa
const filteredClientes = computed(() =>
  clientes.value.filter((cliente) =>
    cliente.nome.toLowerCase().includes(search.value.toLowerCase())
  )
);

// Funções para adicionar, editar e excluir clientes
function showAddClientModal() {
  newClient.value = { nome: '', contacto: '' };
  addClientDialog.value = true;
}

function addClient() {
  if (newClient.value.nome && newClient.value.contacto) {
    const id = clientes.value.length + 1;
    clientes.value.push({ id, ...newClient.value });
    addClientDialog.value = false;
  }
}

function editClient(client: any) {
  newClient.value = { ...client };
  addClientDialog.value = true;
}

function deleteClient(id: number) {
  clientes.value = clientes.value.filter((cliente) => cliente.id !== id);
}

// return {
//   clientes,
//   columns,
//   search,
//   addClientDialog,
//   newClient,
//   filteredClientes,
//   showAddClientModal,
//   addClient,
//   editClient,
//   deleteClient
// }
</script>

<style scoped>
.text-h4 {
  font-weight: bold;
  margin-bottom: 1rem;
}

.q-card-section {
  padding: 1.2rem;
}
</style>
