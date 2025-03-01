<template>
  <q-page padding>
    <!-- Cabeçalho -->
    <div class="text-h4 text-center text-primary">Gestão de Tipo de Peças</div>
    <!-- Tabela de Serviços -->
    <q-card>
      <q-card-section class="row items-center">
        <q-input outlined dense debounce="300" v-model="search" placeholder="Procurar serviços..." class="col-grow">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn class="q-ml-md" color="primary" icon="add" label="Adicionar Tipo de Peça" @click="showAddServiceModal" />
      </q-card-section>

      <q-separator />

      <q-table
        v-if="services.length > 0"
        :rows="filteredServices"
        :columns="columns"
        row-key="id"
        class="q-mt-md"
        bordered
        dense
      >
        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn flat dense icon="edit" color="blue" aria-label="Editar" @click="editService(props.row)" />
            <q-btn flat dense icon="delete" color="red" aria-label="Excluir" @click="deleteTipoPeca(props.row.id)" />
          </q-td>
        </template>
      </q-table>
      <div v-else class="text-center text-grey q-pa-md">Nenhum peça encontrada.</div>
    </q-card>

    <!-- Modal para Adicionar/Editar Serviço -->
    <q-dialog v-model="serviceDialog">
      <q-card style="max-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? "Editar Tipo de Peça" : "Adicionar Tipo de Peça" }}</div>
          <div class="text-caption">
            {{ isEditing ? "Modifique os dados do serviço" : "Preencha os dados para adicionar um novo serviço" }}
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input v-model="currentService.nome" label="Nome da Peça" outlined dense required class="q-mb-sm" />
          <q-input v-model="currentService.descricao" label="Descrição (Opcional)" outlined dense class="q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn flat label="Salvar" color="positive" @click="isEditing ? updateTipoPecas() : addTipoPeca()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "app/utils/Api";
import { Notify } from "quasar";

// Configuração da tabela
const columns = [
  { name: "nome", label: "Nome da Pecá", field: "nome", align: "left" },
  { name: "descricao", label: "Descrição", field: "descricao", align: "left" },
  { name: "actions", label: "Ações", field: "actions", align: "center" },
];

const search = ref("");
const serviceDialog = ref(false);
const currentService = ref({ nome: "", descricao: "" });
const services = ref([]);
const isEditing = ref(false);

// Filtrar serviços com base no campo de pesquisa
const filteredServices = computed(() =>
  services.value.filter((service) =>
    service.nome.toLowerCase().includes(search.value.toLowerCase())
  )
);

// Modal para adicionar um novo serviço
function showAddServiceModal() {
  currentService.value = { nome: "", descricao: "" };
  isEditing.value = false;
  serviceDialog.value = true;
}

// Método para adicionar um novo serviço
async function addTipoPeca() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token faltando, autentique-se");

    if (!currentService.value.nome) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const payload = {
      nome: currentService.value.nome,
      descricao: currentService.value.descricao || "",
    };

    const response = await api.post("api/itemtypes", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Notify.create({
      type: "positive",
      message: "Peça adicionado com sucesso!",
      position: "top-right",
    });

    services.value.push(response.data.data);
    serviceDialog.value = false;
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.message || "Erro ao adicionar o serviço.",
      position: "top-right",
    });
    console.error("Erro ao adicionar serviço:", error);
  }
}

// Método para editar um serviço existente
function editService(service) {
  currentService.value = { ...service };
  isEditing.value = true;
  serviceDialog.value = true;
}

// Método para atualizar um serviço
async function updateTipoPecas() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token faltando, autentique-se");

    if (!currentService.value.nome) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const payload = {
      nome: currentService.value.nome,
      descricao: currentService.value.descricao || "",
    };
    console.log(payload)

    const response = await api.put(
      `api/itemtypes/${currentService.value.id}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Notify.create({
      type: "positive",
      message: "Serviço atualizado com sucesso!",
      position: "top-right",
    });

    const index = services.value.findIndex(
      (service) => service.id === currentService.value.id
    );
    if (index !== -1) {
      services.value[index] = response.data.data;
    }

    serviceDialog.value = false;
  } catch (error) {
    Notify.create({
      type: "negative",
      message:  "Erro ao atualizar o nome da peça, ja existe.",
      position: "top-right",
    });
    console.error("Erro ao atualizar serviço:", error);
  }
}

// Método para excluir um serviço
async function deleteTipoPeca(id) {
  try {
    const confirm = window.confirm("Tem certeza que deseja excluir este serviço?");
    if (!confirm) return;

    const token = localStorage.getItem("auth_token");
    await api.delete(`api/itemtypes/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    Notify.create({
      type: "positive",
      message: "Peça excluída com sucesso!",
      position: "top-right",
    });

    services.value = services.value.filter((service) => service.id !== id);
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.message || "Erro ao excluir serviço.",
      position: "top-right",
    });
    console.error("Erro ao excluir serviço:", error);
  }
}

// Método para buscar serviços da API
async function fetchTipoPecas() {
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Token faltando, autentique-se");

    const response = await api.get("api/itemtypes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    services.value = response.data?.data || [];
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.message || "Erro ao buscar dados.",
      position: "top-right",
    });
    console.error("Erro ao buscar serviços:", error);
  }
}

onMounted(() =>{
  fetchTipoPecas();
});
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
