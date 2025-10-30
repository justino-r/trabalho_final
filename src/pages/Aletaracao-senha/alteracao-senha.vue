<template>
    <q-page class="q-pa-md">
      <div class="text-h5 text-primary q-mb-md">Alterar Senha</div>
  
      <q-form @submit.prevent="alterarSenha">
        <q-input v-model="senhaAtual" label="Senha Atual" type="password" required />
        <q-input v-model="novaSenha" label="Nova Senha" type="password" required />
        <q-input v-model="confirmarSenha" label="Confirmar Nova Senha" type="password" required />
  
        <q-btn label="Alterar Senha" color="primary" type="submit" />
      </q-form>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const senhaAtual = ref('')
  const novaSenha = ref('')
  const confirmarSenha = ref('')
  
  function alterarSenha() {
    if (novaSenha.value !== confirmarSenha.value) {
      alert('As senhas não coincidem!');
      return;
    }
  
    // Enviar para o backend para validar e atualizar a senha
    console.log('Alterando senha...');
    // Simulando uma requisição de alteração de senha
    // Chamar API para alterar a senha
  }
  </script>
  