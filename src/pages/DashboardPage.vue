<template>
  <q-page>

    <!-- <div class="q-py-md">
      <q-btn-group outline>
        <q-btn icon="add" label="Adicionar Cliente" class="q-mr-sm" @click="addCliente" />
        <q-btn icon="inventory" label="Adicionar Peça" class="q-mr-sm" @click="addPeca" />
        <q-btn icon="receipt" label="Nova Fatura" class="q-mr-sm" @click="novaFatura" />
      </q-btn-group>
    </div> -->

    <!-- Cards com métricas principais -->
    <q-card-section class="row q-gutter-mdg q-pb-md">
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
        <q-card class=" bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Clientes</div>
            <div class="text-subtitle2">150 cadastrados</div>
            <q-icon name="people" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Peças Processadas</div>
            <div class="text-subtitle2">320 este mês</div>
            <q-icon name="inventory" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
        <q-card class="bg-positive text-white">
          <q-card-section>
            <div class="text-h6">Receita</div>
            <div class="text-subtitle2">$12,500</div>
            <q-icon name="attach_money" size="40px" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
        <q-card class="bg-negative text-white">
          <q-card-section>
            <div class="text-h6">Despesas</div>
            <div class="text-subtitle2">$4,200</div>
            <q-icon name="money_off" size="40px" />
          </q-card-section>
        </q-card>

    <!--</q-card-section>-->

  </div>
    <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
        <q-card class="bg-negative text-white">
          <q-card-section>
            <div class="text-h6">relatorio</div>
            <div class="text-subtitle2">$4,200</div>
            <q-icon name="money_off" size="40px" />
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>

    <!-- Gráfico -->
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Fluxo de Caixa</div>
        </q-card-section>
        <q-card-section>
          <div>
            <!-- Substituir pelo componente de gráfico (Ex.: Chart.js, ECharts, etc.) -->
            <q-skeleton type="QChart" class="q-mt-md" style="height: 300px;" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "Dashboard",
  methods: {
    addCliente() {
      this.$router.push("/clientes/adicionar");
    },
    addPeca() {
      this.$router.push("/pecas/adicionar");
    },
    novaFatura() {
      this.$router.push("/faturas/gerar");
    },
  },
};
</script>

<style>
.bg-primary {
  background-color: #027be3;
}

.bg-secondary {
  background-color: #039be5;
}

.bg-positive {
  background-color: #4caf50;
}

.bg-negative {
  background-color: #f44336;
}
</style>
