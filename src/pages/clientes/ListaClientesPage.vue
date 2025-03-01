<template>
  <q-page padding>
    <div class="header-title">Gestão de Clientes</div>

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
        :rows="clientes"
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
              @click="showEditClientModal(props.row)"
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

    <q-dialog v-model="addClientDialog">
      <q-card style="max-width: 500px">
        <q-card-section>
          <div class="modal-title">Adicionar Cliente</div>
          <div class="modal-subtitle">Preencha os dados abaixo para adicionar um novo cliente</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input v-model="newClient.nome" label="Nome" outlined dense required class="q-mb-sm" />
          <q-input v-model="newClient.contacto" label="Contacto" outlined dense required class="q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="positive" @click="addClient" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editClientDialog">
      <q-card style="max-width: 900px">
        <q-card-section>
          <div class="modal-title">Editar Cliente</div>
          <div class="modal-subtitle">Atualize os dados do cliente selecionado</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input v-model="editClientData.nome" label="Nome" outlined dense required class="q-mb-sm" />
          <q-input v-model="editClientData.contacto" label="Contacto" outlined dense required class="q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Atualizar" color="positive" @click="updateClient" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import api from "app/utils/Api";
import { useQuasar } from "quasar";
import { Notify } from "quasar";

interface Cliente {
  id: number;
  nome: string;
  contacto: string;
  email: string;
}

const $q = useQuasar();
const clientes = ref<Cliente[]>([]);
const search = ref<string>("");
const addClientDialog = ref<boolean>(false);
const editClientDialog = ref<boolean>(false);

const newClient = ref<Partial<Cliente>>({ nome: "", contacto: "", email: "" });
const editClientData = ref<Cliente>({ id: 0, nome: "", contacto: "", email: "" });

const columns = [
  { name: "nome", label: "Nome", field: "nome", required: true, align: "left" },
  { name: "contacto", label: "Contacto", field: "contacto", align: "left" },
  { name: "actions", label: "Ações", field: "actions", align: "center" },
];

async function fetchClientes() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado.");

    const response = await api.get(`api/customers?filter[nome]=${search.value}&sort=nome`, {
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

function showAddClientModal() {
  newClient.value = { nome: "", contacto: "", email: "" };
  addClientDialog.value = true;
}

function showEditClientModal(cliente: Cliente) {
  editClientData.value = { ...cliente };
  editClientDialog.value = true;
}

async function updateClient() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado.");

    await api.put(`api/customers/${editClientData.value.id}`, editClientData.value, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Notify.create({ message: "Cliente atualizado com sucesso!", type: "positive", position: "top-right" });
    editClientDialog.value = false;
    fetchClientes();
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    Notify.create({ message: "Erro ao atualizar cliente.", type: "negative", position: "top-right" });
  }
}

async function addClient() {
  if (!newClient.value.nome || !newClient.value.contacto) {
    Notify.create({ message: "Todos os campos são obrigatórios.", type: "warning", position: "top" });
    return;
  }

  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token de autenticação não encontrado.");

    await api.post("api/customers", newClient.value, { headers: { Authorization: `Bearer ${token}` } });

    Notify.create({ message: "Cliente adicionado com sucesso!", type: "positive", position: "top-right" });
    addClientDialog.value = false;
    fetchClientes();
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    Notify.create({ message: "Erro ao adicionar cliente.", type: "negative", position: "top-right" });
  }
}

async function deleteClient(id: number) {
  $q.dialog({
    title: "Apagar",
    message: "Deseja apagar o cliente?",
    persistent: true,
    cancel: true,
    ok: "Sim",
  }).onOk(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) throw new Error("Token de autenticação não encontrado.");

      await api.delete(`api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Notify.create({ message: "Cliente excluído com sucesso", type: "positive", position: "top-left" });
      fetchClientes();
    } catch (error) {
      Notify.create({ message: "Erro ao excluir cliente", type: "negative", position: "top-right" });
    }
  });
}

watch(search, fetchClientes);

onMounted(fetchClientes);
</script>

<style>
.header-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--q-primary);
  text-align: center;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--q-primary);
}

.modal-subtitle {
  font-size: 14px;
  color: var(--q-gray-7);
  margin-top: 5px;
}
</style>
