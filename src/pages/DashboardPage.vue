<template>
  <q-page>
    <q-card-section>
      <!-- <div class="text-h5">Bem-vindo, {{ authUser?.name || 'Usuário' }}!</div> -->
    </q-card-section>

    <!-- Cards com métricas principais -->
    <q-card-section class="row q-gutter-mdg q-pb-md">
      <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
        <q-card class="bg-primary text-white">
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
      </div>
    </q-card-section>

    <div class="col-xs-12 col-sm-6 col-md-3 q-pa-sm">
      <q-card class="bg-negative text-white">
        <q-card-section>
          <div class="text-h6">Relatório</div>
          <div class="text-subtitle2">$4,200</div>
          <q-icon name="money_off" size="40px" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Gráfico -->
    <div class="q-pa-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Fluxo de Caixa</div>
        </q-card-section>
        <q-card-section>
          <q-skeleton type="QChart" class="q-mt-md" style="height: 300px;" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

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

<script setup>

import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useAuthStore();
const { authUser} = storeToRefs(store)
onMounted(() => {
  // Restaurar usuário do localStorage
  store.loadUserFromStorage();
});



const addCliente = () => {
  router.push("/clientes/adicionar");
};

const addPeca = () => {
  router.push("/pecas/adicionar");
};

const novaFatura = () => {
  router.push("/faturas/gerar");
};


</script>
