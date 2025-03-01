<template>
  <div>
    <!-- Gestão de Cargos -->
    <div class="role-management-page">
      <div class="header-title">Gestão de Clientes</div>

      <!-- Formulário de Cadastro de Cargo -->
      <q-form @submit.prevent="submitCargoForm">
        <div class="section">
          <div class="header-title-cargo">Adicionar novo Cargo</div>
          <q-input
            filled
            v-model="currentCargo.nome"
            label="Nome do Cargo"
            error-message="O nome é obrigatório."
            required
          />
          <q-input
            filled
            v-model="currentCargo.descricao"
            label="Descrição"
            error-message="A descrição é obrigatória."
            required
          />
          <q-input
            filled
            v-model.number="currentCargo.salario"
            label="Salário Padrão (MZN)"
            type="number"
            error-message="O salário é obrigatório."
            required
          />
          <q-btn label="Salvar Cargo" color="primary" type="submit" />
          <q-btn label="Cancelar" color="negative" @click="resetCargoForm" />
        </div>
      </q-form>

      <!-- Tabela de Cargos -->
      <div class="section">
        <div class="header-title-cargo">Cargos Adicionados</div>
        <q-table
          :rows="cargos"
          :columns="cargoColumns"
          row-key="id"
          flat
          bordered
          dense
        >
          <template v-slot:body-cell-actions="props">
            <q-btn
              icon="edit"
              color="primary"
              size="sm"
              @click="openEditModal(props.row)"
            />
            <q-btn
              icon="delete"
              color="negative"
              size="sm"
              @click="deleteCargo(props.row.id)"
            />
          </template>
        </q-table>
      </div>

      <!-- Modal de Edição -->
      <q-dialog v-model="isEditModalOpen">
        <q-card class="edit-modal-card">
          <q-card-section>
            <div class="text-h6">Editar Cargo</div>
          </q-card-section>

          <q-card-section>
            <q-input
              filled
              v-model="editCargoData.nome"
              label="Nome do Cargo"
              required
            />
            <q-input
              filled
              v-model="editCargoData.descricao"
              label="Descrição"
              required
            />
            <q-input
              filled
              v-model.number="editCargoData.salario"
              label="Salário Padrão (MZN)"
              type="number"
              required
            />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="negative" @click="closeEditModal" />
            <q-btn flat label="Salvar" color="primary" @click="handleEditCargo" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "app/utils/Api";

import { Notify } from "quasar";
/* Estado e métodos para cargos */
const currentCargo = ref({ nome: "", descricao: "", salario: 0 });
const cargos = ref([]);
const editCargoData = ref({ id: 0, nome: "", descricao: "", salario: 0 });
const isEditModalOpen = ref(false);

const cargoColumns = [
  { name: "nome", label: "Nome do Cargo", align: "left", field: "nome" },
  { name: "descricao", label: "Descrição", align: "left", field: "descricao" },
  { name: "salario", label: "Salário", align: "right", field: "salario" },
  { name: "actions", label: "Ações", align: "center", field: "actions" },
];

async function fetchCargos(): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    const response = await api.get("/api/positions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    cargos.value = response.data.data || [];
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
  }
}

function resetCargoForm(): void {
  currentCargo.value = { nome: "", descricao: "", salario: 0 };
}

async function submitCargoForm(): Promise<void> {
  try {
    const token = localStorage.getItem("auth_token");
    await api.post("/api/positions", currentCargo.value, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCargos();
    resetCargoForm();
    alert("Cargo salvo com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar cargo:", error);
  }
}

async function deleteCargo(id: number): Promise<void> {
  const confirmDelete = confirm(
    "Tem certeza de que deseja excluir este cargo?"
  );
  if (!confirmDelete) return;
  try {
    const token = localStorage.getItem("auth_token");
    await api.delete(`/api/positions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCargos();
    alert("Cargo excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir cargo:", error);
  }
}

/* Métodos do Modal */
function openEditModal(cargo: any): void {
  editCargoData.value = { ...cargo };
  isEditModalOpen.value = true;
}

function closeEditModal(): void {
  isEditModalOpen.value = false;
}

async function handleEditCargo(): Promise<void> {
  if (!editCargoData.value.nome || !editCargoData.value.descricao || !editCargoData.value.salario) {
    Notify.create({
      message:  'Todos os campos devem ser preenchido.',
      type: 'positive',
      position: 'top-right'
    });
    return;
  }
  try {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("Autenticação necessária!");
    console.log(editCargoData.value)
    await api.put(
      `/api/positions/${editCargoData.value.id}`,
      editCargoData.value,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    Notify.create({
      message:  'Cargo actualizado salvar peça.',
      type: 'positive',
      position: 'top-right'
    });
    isEditModalOpen.value = false;
    fetchCargos();
  } catch (error: any) {
    Notify.create({
      message: error.message || "Erro ao actualizar o cargo",
      type: "negative",
      position: "top-right"
    })
    console.log("Erro a actualizar cargo", error.message)
  }
}

onMounted(() => {
  fetchCargos();
});
</script>

<style scoped>
.header-title {
  font-size: 30px;
  font-weight: bold;
  color: var(--q-primary);
  text-align: center;
  margin-bottom: 20px;
}
.header-title-cargo {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
}
.role-management-page {
  padding: 20px;
}

.section {
  margin-bottom: 20px;
}

.q-btn {
  margin: 10px;
}

.edit-modal-card {
  width: 500px;
  max-width: 90%;
  min-height: 300px;
  max-height: 90%;
}
</style>
