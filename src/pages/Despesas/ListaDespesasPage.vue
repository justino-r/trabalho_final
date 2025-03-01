<template>
  <div class="despesas-page">
    <h4>Gestao de despesas</h4>

    <!-- Seção de Cadastro de Despesas -->
    <div class="cadastro-despesas">
      <q-card>
        <q-card-section>
          <h5>Registrar Nova Despesa</h5>
          <q-input v-model="novaDespesa.descricao" label="Descrição" filled />
          <q-input v-model.number="novaDespesa.valor" label="Valor (MZN)" type="number" filled />
          <q-select
            v-model="novaDespesa.funcionario_id"
            :options="funcionarios"
            label="Responsável"
            outlined
            dense
            option-label="nome"
            option-value="id"
            map-options
          />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Registrar" color="primary" @click="adicionarDespesa" />
          <q-btn label="Limpar" color="secondary" flat @click="limparFormulario" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Tabela de Despesas -->
    <div class="tabela-despesas">
      <q-table :rows="despesas" :columns="columns" row-key="id">
        <template v-slot:body-cell-acoes="props">
          <q-btn icon="edit" color="blue" flat @click="abrirModalEdicao(props.row)" />
          <q-btn icon="delete" color="red" flat @click="abrirModalDeletar(props.row.id)" />
        </template>
      </q-table>
    </div>

    <!-- Resumo Semanal -->
    <div class="resumo-semanal">
      <h2>Total de Despesas da Semana: {{ totalSemanal }} MZN</h2>
    </div>

    <!-- Modal de Edição de Despesa -->
    <q-dialog v-model="modalEdicao">
      <q-card>
        <q-card-section>
          <h3>Editar Despesa</h3>
          <q-input v-model="despesaEmEdicao.descricao" label="Descrição" filled />
          <q-input v-model.number="despesaEmEdicao.valor" label="Valor (MZN)" type="number" filled />
          <q-select
            v-model="despesaEmEdicao.funcionario_id"
            :options="funcionarios"
            label="Responsável"
            outlined
            dense
            option-label="nome"
            option-value="id"
            map-options
          />
        </q-card-section>
        <q-card-actions>
          <q-btn label="Cancelar" color="secondary" flat @click="fecharModalEdicao" />
          <q-btn label="Salvar" color="primary" flat @click="salvarEdicao" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Confirmação de Exclusão -->
    <q-dialog v-model="modalDeletar">
      <q-card>
        <q-card-section>
          <div class="text-h6">Deseja realmente excluir esta despesa?</div>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Cancelar" color="secondary" flat @click="fecharModalDeletar" />
          <q-btn label="Excluir" color="negative" flat @click="confirmarRemoverDespesa" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import api from 'app/utils/Api';

export default {
  setup() {
    const novaDespesa = ref({ descricao: '', valor: 0, funcionario_id: null });
    const despesas = ref([]);
    const funcionarios = ref([]);
    const modalDeletar = ref(false); // Para controlar a exibição do modal
    const modalEdicao = ref(false); // Para controlar o modal de edição
    const despesaIdParaDeletar = ref(null); // Armazena o ID da despesa a ser deletada
    const despesaEmEdicao = ref({ descricao: '', valor: 0, funcionario_id: null }); // Para editar uma despesa

    const columns = [
      { name: 'descricao', label: 'Descrição', field: 'descricao' },
      { name: 'valor', label: 'Valor (MZN)', field: 'valor', align: 'right' },
      { name: 'data', label: 'Data', field: 'data' },
      { name: 'responsavel', label: 'Responsável', field: 'responsavel' },
      { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' },
    ];

    const totalSemanal = computed(() => {
      const semanaAtual = obterSemanaAtual();
      return despesas.value
        .filter((despesa) => semanaAtual.includes(despesa.data))
        .reduce((total, despesa) => total + despesa.valor, 0);
    });

    async function fetchFuncionarios() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Token faltando, autentique-se');

        const response = await api.get('api/employees', {
          headers: { Authorization: `Bearer ${token}` },
        });
        funcionarios.value = response.data.data;
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      }
    }

    async function fetchDespesas() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Token de autenticação não encontrado.');

        const response = await api.get('api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          despesas.value = response.data.data;
        } else {
          console.error('Formato inesperado dos dados da API:', response.data);
        }
      } catch (error) {
        console.error('Erro ao buscar despesas:', error);
      }
    }

    async function adicionarDespesa() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Token de autenticação não encontrado.');

        if (!novaDespesa.value.descricao || !novaDespesa.value.valor || !novaDespesa.value.funcionario_id) {
          throw new Error('Preencha todos os campos obrigatórios.');
        }

        const payload = {
          descricao: novaDespesa.value.descricao,
          valor: novaDespesa.value.valor,
          funcionario_id: novaDespesa.value.funcionario_id.id,
        };

        const response = await api.post('api/expenses', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        despesas.value.push(response.data.data);
        limparFormulario();
      } catch (error) {
        console.error('Erro ao adicionar despesa:', error);
      }
    }

    function limparFormulario() {
      novaDespesa.value = { descricao: '', valor: 0, funcionario_id: null };
    }

    // Abre o modal de edição e preenche com dados da despesa
    function abrirModalEdicao(despesa) {
      despesaEmEdicao.value = { ...despesa };
      modalEdicao.value = true;
    }

    // Fecha o modal de edição sem salvar alterações
    function fecharModalEdicao() {
      modalEdicao.value = false;
      despesaEmEdicao.value = { descricao: '', valor: 0, funcionario_id: null };
    }

    // Salva as alterações feitas na despesa
    async function salvarEdicao() {
   try {
     const token = localStorage.getItem('auth_token');
     if (!token) throw new Error('Token de autenticação não encontrado.');

     const response = await api.put(`api/expenses/${despesaEmEdicao.value.id}`, despesaEmEdicao.value, {
       headers: { Authorization: `Bearer ${token}` },
     });

     // Recarregar as despesas da API
     await fetchDespesas();

     fecharModalEdicao();
   } catch (error) {
     console.error('Erro ao editar despesa:', error);
   }
 }


    // Abre o modal de confirmação de exclusão
    function abrirModalDeletar(id) {
      modalDeletar.value = true;
      despesaIdParaDeletar.value = id;
    }

    // Fecha o modal sem excluir a despesa
    function fecharModalDeletar() {
      modalDeletar.value = false;
      despesaIdParaDeletar.value = null;
    }

    // Confirma a exclusão da despesa
    async function confirmarRemoverDespesa() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('Token de autenticação não encontrado.');

        const response = await api.delete(`api/expenses/${despesaIdParaDeletar.value}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Remove a despesa da lista após a exclusão
        despesas.value = despesas.value.filter((despesa) => despesa.id !== despesaIdParaDeletar.value);
        fecharModalDeletar();
      } catch (error) {
        console.error('Erro ao remover despesa:', error);
      }
    }

    function obterSemanaAtual() {
      const hoje = new Date();
      const primeiroDia = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
      return Array.from({ length: 7 }, (_, i) => {
        const dia = new Date(primeiroDia);
        dia.setDate(primeiroDia.getDate() + i);
        return dia.toISOString().split('T')[0];
      });
    }

    onMounted(() => {
      fetchFuncionarios();
      fetchDespesas();
    });

    return {
      novaDespesa,
      despesas,
      funcionarios,
      columns,
      totalSemanal,
      adicionarDespesa,
      limparFormulario,
      abrirModalEdicao,
      fecharModalEdicao,
      salvarEdicao,
      abrirModalDeletar,
      fecharModalDeletar,
      confirmarRemoverDespesa,
      modalEdicao,
      modalDeletar,
      despesaEmEdicao,
    };
  },
};
</script>
