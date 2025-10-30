<template>
    <q-page class="q-pa-md">
      <div class="text-h5 text-primary q-mb-md">Criar Conta para Cliente</div>
    
      <q-form @submit.prevent="criarConta">
        <q-input v-model="cliente.nome" label="Nome do Cliente" required />
        <q-input v-model="cliente.email" label="E-mail" type="email" required />
        
        <q-btn label="Gerar Senha Automática" color="primary" @click="gerarSenha" />
        
        <div><strong>Senha Gerada:</strong> {{ senhaGerada }}</div>
        
        <q-btn label="Criar Conta" color="primary" type="submit" />
      </q-form>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const cliente = ref({
    nome: '',
    email: ''
  })
  
  const senhaGerada = ref('')
  
  function gerarSenha() {
    // Gerar uma senha aleatória (exemplo simples)
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let senha = '';
    for (let i = 0; i < 8; i++) {
      senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    senhaGerada.value = senha;
  }
  
  function criarConta() {
    // Aqui você deve salvar o cliente no banco de dados
    const novaConta = {
      nome: cliente.value.nome,
      email: cliente.value.email,
      senha: senhaGerada.value // A senha gerada
    }
  
    // Simulando o envio ao backend para salvar
    console.log('Criar conta com os dados:', novaConta);
    // Chamar API para salvar no banco (com senha criptografada)
  }
  </script>
  