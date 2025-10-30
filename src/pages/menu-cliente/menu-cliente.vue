<template>
  <q-layout view="hHh LpR fFf">
    <!-- Menu lateral -->
    <q-drawer show-if-above :width="300" class="bg-blue-9 text-white">
      <q-list>
        <q-item clickable v-ripple to="/pedidos-confirmados">
          <q-item-section avatar>
            <q-icon name="check_circle" color="white" />
          </q-item-section>
          <q-item-section>Pedidos Confirmados</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/pedidos-efectuados">
          <q-item-section avatar>
            <q-icon name="list_alt" color="white" />
          </q-item-section>
          <q-item-section>Pedidos Efetuados</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/cliente">
          <q-item-section avatar>
            <q-icon name="person_add" color="white" />
          </q-item-section>
          <q-item-section>Efetuar Pedido</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/consultar-estado">
          <q-item-section avatar>
            <q-icon name="info" color="white" />
          </q-item-section>
          <q-item-section>Consultar Estado</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Área principal -->
    <q-page-container>
      <!-- Botões grandes e coloridos no meio -->
      <div class="main-buttons q-pa-lg">
        <q-btn
          label="Efetuar Pedido"
          icon="add_shopping_cart"
          color="orange"
          class="q-ma-sm btn-xxxl"
          to="/cliente"
        />
        <q-btn
          label="Pedidos Confirmados"
          icon="check_circle"
          color="green"
          class="q-ma-sm btn-xxxl"
          to="/pedidos-confirmados"
        />
        <q-btn
          label="Estado dos Pedidos"
          icon="info"
          color="blue"
          class="q-ma-sm btn-xxxl"
          to="/consultar-estado"
        />
        <q-btn
          label="Pedidos Efetuados"
          icon="list_alt"
          color="purple"
          class="q-ma-sm btn-xxxl"
          to="/pedidos-efectuados"
        />
      </div>

      <!-- Gráficos ampliados -->
      <div class="charts-container q-pa-lg">
        <div class="chart-full-width">
          <canvas id="ordersChart"></canvas>
        </div>
        <div class="chart-full-width">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted } from "vue";
import Chart from "chart.js/auto";

onMounted(() => {
  // Gráfico de Pedidos (Barra)
  new Chart(document.getElementById("ordersChart"), {
    type: "bar",
    data: {
      labels: ["Confirmados", "Efetuados", "Cancelados"],
      datasets: [
        {
          label: "Quantidade de Pedidos",
          data: [50, 75, 10],
          backgroundColor: ["#4caf50", "#2196f3", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
    },
  });

  // Gráfico de Rendimento (Linha)
  new Chart(document.getElementById("revenueChart"), {
    type: "line",
    data: {
      labels: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      datasets: [
        {
          label: "Rendimento em Mzn",
          data: [1000, 1200, 1500, 2000, 1800, 2200, 2100, 2300, 2500, 2700, 3000, 3200],
          borderColor: "#ff9800",
          backgroundColor: "rgba(255, 152, 0, 0.3)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
      },
    },
  });
});
</script>

<style scoped>
.q-drawer {
  padding-top: 39px;
}
.q-item {
  margin-bottom: 18px;
  border-radius: 19px;
}
.q-item:hover {
  background-color: rgb(231, 76, 15);
}
.main-buttons {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 40px;
}
.btn-xxxl {
  width: 300px;
  height: 120px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 12px;
}
.chart-full-width {
  width: 100%;
  height: 400px;
  margin: 20px 0;
}
</style>