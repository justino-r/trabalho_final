<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md full-height">
      <q-card-section class="row justify-between items-center">
        <div class="text-h5 text-primary">Solicitar Lavagem</div>
      </q-card-section>

      <q-card-section>
        <q-select v-model="tipoLavagem" :options="['Urgente', 'Normal']" label="Tipo de Lavagem" outlined />
      </q-card-section>

      <q-card-section>
        <q-select v-model="pecaSelecionada" :options="pecas" label="Escolha de Peça" outlined />
      </q-card-section>

      <q-card-section>
        <q-select v-model="servicoSelecionado" :options="servicos" label="Escolha o Serviço" outlined />
      </q-card-section>

      <q-card-section>
        <div class="row items-center">
          <div class="q-mr-md">Tem anomalia?</div>
          <q-radio v-model="anomalia" val="sim" label="Sim" />
          <q-radio v-model="anomalia" val="nao" label="Não" />
        </div>
        <q-input v-if="anomalia === 'sim'" v-model="descricaoAnomalia" label="Descreva a anomalia" outlined class="q-mt-md" />
      </q-card-section>

      <q-card-section>
        <q-btn color="secondary" label="Adicionar à Lista" @click="adicionarPeca" />
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item v-for="(item, index) in carrinho" :key="index">
            <q-item-section>{{ item.peca }} - {{ item.servico }} - {{ item.preco }} MZN</q-item-section>
            <q-item-section side>
              <q-btn icon="edit" color="warning" flat @click="editarPeca(index)" />
              <q-btn icon="delete" color="red" flat @click="removerPeca(index)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <div class="text-h6 text-primary">Total: {{ total }} MZN</div>
      </q-card-section>

      <q-card-section>
        <q-btn color="primary" label="Consultar Disponibilidade" @click="consultarDisponibilidade" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const tipoLavagem = ref('');
const pecaSelecionada = ref('');
const servicoSelecionado = ref('');
const anomalia = ref('nao');
const descricaoAnomalia = ref('');
const carrinho = ref([]);
const total = ref(0);

const pecas = ['Camisa', 'Calça', 'Vestido', 'Sapatilhas'];
const servicos = [
  { label: 'Lavagem Normal', value: 'Lavagem Normal', preco: 100 },
  { label: 'Engomar a Ferro', value: 'Engomar a Ferro', preco: 50 },
  { label: 'Engomagem a Vapor', value: 'Engomagem a Vapor', preco: 60 },
  { label: 'Lavagem a Seco', value: 'Lavagem a Seco', preco: 120 },
  { label: 'Lavagem de Sapatilhas', value: 'Lavagem de Sapatilhas', preco: 150 }
];

function consultarDisponibilidade() {
  // Função para enviar os dados para a lavandaria e consultar a disponibilidade
  if (carrinho.value.length > 0) {
    // Aqui você pode adicionar a lógica para enviar os pedidos ao sistema da lavandaria
    // Exemplo: enviar para a API da lavandaria
    console.log("Enviando para o sistema da lavandaria: ", carrinho.value);
    $q.notify({ type: 'positive', message: 'Pedido enviado com sucesso para a lavandaria!' });
  } else {
    $q.notify({ type: 'negative', message: 'Por favor, adicione peças à lista!' });
  }
}

function adicionarPeca() {
  if (pecaSelecionada.value && servicoSelecionado.value) {
    carrinho.value.push({
      peca: pecaSelecionada.value,
      servico: servicoSelecionado.value.label,
      preco: servicoSelecionado.value.preco,
      anomalia: anomalia.value === 'sim' ? descricaoAnomalia.value : 'Sem anomalia'
    });
    total.value += servicoSelecionado.value.preco;
  }
}

function removerPeca(index) {
  total.value -= carrinho.value[index].preco;
  carrinho.value.splice(index, 1);
}

function editarPeca(index) {
  // Lógica para editar a peça
  // Você pode adicionar uma função para editar as peças na lista de carrinho
  console.log("Editando peça: ", carrinho.value[index]);
}
</script>
