<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Lavanderia Dashboard
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Menu
        </q-item-label>

        <!-- Opções do sistema -->
        <q-item clickable v-ripple @click="navigateTo('/dashboard')">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Dashboard</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/servicos')">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Serviços</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/tipo_pecas')">
          <q-item-section avatar>
            <q-icon name="checkroom" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Tipo de Peça</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/clientes')">
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Clientes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/pecas')">
          <q-item-section avatar>
            <q-icon name="inventory" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Peças</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/faturas')">
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Faturas</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/Relatorio')">
          <q-item-section avatar>
            <q-icon name="leaderboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Relatorios</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/Funcionarios')">
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Funcionarios</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="navigateTo('/despesas')">
          <q-item-section avatar>
            <q-icon name="money_off" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Despesas</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Conteúdo principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const leftDrawerOpen = ref(false);
const router = useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function navigateTo(path: string) {
  router.push(path);
}
</script>
