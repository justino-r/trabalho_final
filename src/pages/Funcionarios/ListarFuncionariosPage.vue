<template>
  <div class="employee-form-page">
    <div class="header-title">Gestão de Funcionários</div>

    <!-- Formulário de Cadastro de Funcionário -->
    <q-form @submit.prevent="addFuncionario">
      <div class="section">
        <div class="header-title-dados">Dados do Funcionário</div>
        <q-input v-model="employee.nome" label="Nome Completo" required />
        <q-select v-if="cargos.length > 0" :options="cargos" v-model="employee.cargo_id" label="Cargo" outlined dense
          option-label="nome" option-value="id" />
        <p v-if="cargos.length === 0" class="warning">Nenhum cargo encontrado, registe um cargo</p>
      </div>

      <div class="section">
        <p>Senha Padrão Gerada: <strong>{{ defaultPassword }}</strong></p>
      </div>

      <q-btn label="Salvar Funcionário" color="primary" type="submit" :disabled="!cargos.length" />
      <q-btn label="Cancelar" color="negative" @click="cancelForm" />
    </q-form>

    <!-- Tabela de Funcionários -->
    <div class="section tabela">
      <q-table :rows="employees" :columns="columns" row-key="id" :rows-per-page-options="[5, 10, 15]">
        <template v-slot:body-cell-nome="props">
          <q-td :props="props">
            {{ props.row.nome }}
          </q-td>
        </template>

        <template v-slot:body-cell-cargo="props">
          <q-td :props="props">
            {{ props.row.User_id }}
          </q-td>
        </template>

      </q-table>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from "vue";
import api from "app/utils/Api";
import { Notify } from "quasar";

export default {
  setup() {
    const employee = reactive({ nome: "", User_id: 0 });
    const cargos = ref([]);
    const defaultPassword = ref("123456");
    const employees = ref([]);

    const columns = [
      { name: "nome", label: "Nome Completo", field: "nome" },
      { name: "cargo", label: "User_Id", field: "user_id" },
    ];

    // Função para buscar cargos
    async function fetchCargos() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Token faltando, autentique-se");

        const response = await api.get("api/positions", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.data?.length > 0) {
          cargos.value = response.data.data;
        } else {
          cargos.value = []; // Definir vazio se não houver cargos
          console.warn("Nenhum cargo encontrado.");
        }
      } catch (error) {
        Notify.create({
          type: "negative",
          message: error.message || "Erro ao adicionar o funcionario.",
          position: "top-right",
        });
        cargos.value = []; // Garantir que a variável esteja definida como um array vazio
      }
    }

    // Função para buscar todos os funcionários
    async function fetchEmployees() {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("Token faltando, autentique-se");

        const response = await api.get("api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        employees.value = response.data?.data || [];
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Erro ao buscar funcionarios",
          position: "top-right",
        });
      }
    }

    // Função para adicionar um novo funcionário
    async function addFuncionario() {
      try {
        const token = localStorage.getItem("auth_token");
        const userId = localStorage.getItem("user_id");
        const id = parseInt(userId);
        if (!token || !userId) throw new Error("Token ou usuário faltando");

        const newFuncionario = {
          nome: employee.nome,
          cargo_id: employee.cargo_id.id, // Ajustando para enviar cargo_id corretamente

        };
        console.log(newFuncionario)

        const response = await api.post("api/employees", newFuncionario, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Notify.create({
          type: "positive",
          message: "Funcionario adicionado com sucesso!",
          position: "top-right",
        });
        // Adiciona o novo funcionário à lista
        employees.value.push(response.data.data);

        // Limpa o formulário
        employee.nome = "";
        employee.cargo_id = 0;
      } catch (error) {
        Notify.create({
          type: "negative",
          message: "Erro ao adicionario funcionario!",
          position: "top-right",
        });
      }
    }

    // Função para cancelar o formulário
    function cancelForm() {
      employee.nome = "";
      employee.cargo_id = 0;
    }

    // Chama as funções ao montar o componente
    onMounted(() => {
      fetchCargos();
      fetchEmployees();
    });

    return {
      employee,
      cargos,
      defaultPassword,
      addFuncionario,
      cancelForm,
      employees,
      columns,
    };
  },
};
</script>

<style scoped>
.header-title {
  font-size: 30px;
  font-weight: 600;
  color: var(--q-primary);
  text-align: center;
  margin-bottom: 20px;
}

.header-title-dados {
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
}

.employee-form-page {
  padding: 20px;
}

.section {
  margin-bottom: 20px;
}

.q-form {
  max-width: 600px;
  margin: auto;
}

.q-btn {
  margin-top: 20px;
  margin-right: 10px;
}

.tabela {
  margin-top: 20px;
}
</style>
