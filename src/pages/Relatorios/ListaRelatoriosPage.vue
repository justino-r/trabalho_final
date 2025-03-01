<template>
  <q-page padding>
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h5 text-primary">Nova Fatura</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Pesquisar Cliente -->
            <div class="col-6">
              <q-input filled label="Pesquisar Cliente" v-model="pesquisaCliente" />
            </div>

            <!-- Adicionar Cliente -->
            <div class="col-6 text-right">
              <q-btn label="Adicionar Cliente" color="primary" @click="adicionarCliente" />
            </div>
          </div>

          <!-- Detalhes do Cliente e Total -->
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-12 text-right">
              <q-card flat bordered class="q-pa-md">
                <div class="text-subtitle1">Detalhes do Cliente</div>
                <div class="text-caption">Total</div>
              </q-card>
            </div>
          </div>

          <!-- Selecionar Serviço e Itens Selecionados -->
          <div class="row q-col-gutter-md q-mt-md">
            <div class="col-6">
              <q-card flat bordered>
                <q-card-section>
                  <q-select filled label="Selecionar Serviço" v-model="servicoSelecionado" :options="servicos"
                    @input="atualizarPecas" />
                </q-card-section>

                <q-card-section>
                  <q-list bordered>
                    <q-item v-for="peca in pecas" :key="peca.id" clickable @click="adicionarPeca(peca)">
                      <q-item-section>{{ peca.nome }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6">
              <q-card flat bordered>
                <q-card-section>
                  <div class="text-h6 text-primary">Selecionados</div>
                </q-card-section>

                <q-card-section>
                  <q-list bordered>
                    <q-item v-for="item in selecionados" :key="item.id" clickable @click="removerPeca(item)">
                      <q-item-section>{{ item.nome }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      pesquisaCliente: '',
      servicoSelecionado: null,
      servicos: [
        { label: 'Serviço A', value: 'a' },
        { label: 'Serviço B', value: 'b' },
        { label: 'Serviço C', value: 'c' },
      ],
      pecas: [],
      selecionados: [],
      pecasPorServico: {
        a: [
          { id: 1, nome: 'Peça 1' },
          { id: 2, nome: 'Peça 2' },
        ],
        b: [
          { id: 3, nome: 'Peça 3' },
          { id: 4, nome: 'Peça 4' },
        ],
        c: [
          { id: 5, nome: 'Peça 5' },
          { id: 6, nome: 'Peça 6' },
        ],
      },
    };
  },
  methods: {
    atualizarPecas() {
      this.pecas = this.pecasPorServico[this.servicoSelecionado] || [];
    },
    adicionarPeca(peca) {
      if (!this.selecionados.includes(peca)) {
        this.selecionados.push(peca);
      }
    },
    removerPeca(peca) {
      this.selecionados = this.selecionados.filter((item) => item.id !== peca.id);
    },
    adicionarCliente() {
      // Lógica para adicionar cliente
    },
  },
};
</script>

<style>
.text-primary {
  color: #027be3;
}
</style>
