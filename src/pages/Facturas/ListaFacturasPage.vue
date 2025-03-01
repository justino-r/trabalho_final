<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h5 text-primary">Nova factura</div>
      </q-card-section>

      <q-card-section class="row q-gutter-md">
        <q-input filled label="Pesquisar cliente" class="col" />
        <q-btn color="primary" label="Adicionar cliente" class="col-auto" />
      </q-card-section>

      <q-card-section>
        <div class="text-primary text-subtitle1">Selecionar peças</div>
      </q-card-section>

      <q-card-section class="row">
        <q-card class="col-6 q-pa-md">
          <div class="text-primary text-bold">Selecionar Serviço</div>
          <q-select filled label="Selecionar Serviço" :options="servicos" class="q-mt-md" />
          <q-list bordered separator class="q-mt-md">
            <q-item v-for="(item, index) in servicos" :key="index" clickable>
              <q-item-section>{{ item }}</q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-card class="col-6 q-pa-md">
          <div class="text-primary text-bold">Selecionados</div>
          <q-list bordered separator class="q-mt-md">
            <q-item v-for="(item, index) in selecionados" :key="index" clickable>
              <q-item-section>{{ item }}</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-card-section>

      <q-card-section class="q-mt-md">
        <q-card class="q-pa-md">
          <div class="text-primary text-bold">Detalhes do cliente</div>
          <div>Total: {{ total }}</div>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      servicos: ['Serviço 1', 'Serviço 2', 'Serviço 3', 'Serviço 4'],
      selecionados: [],
      total: '0,00 MZN'
    };
  }
};
</script>

<style scoped>
.q-card {
  background-color: #f8f9fa;
}
</style>
