<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section class="row justify-between items-center">
        <div class="row items-center">
          <q-img src="https://s3.eu-central-1.amazonaws.com/zl-clients-sharings/90Tech.png" style="width: 120px;" />
        </div>
        <div class="text-right">
          <div class="text-h5 text-primary">FACTURE</div>
          <div><strong>N°90T-17-01-0123</strong></div>
        </div>
      </q-card-section>

      <q-card-section class="row justify-between">
        <div>
          <strong>90TECH SAS</strong><br>
          6B Rue Aux-Saussaies-Des-Dames<br>
          57950 MONTIGNY-LES-METZ
        </div>
        <div class="text-right">
          <strong>Energies54</strong><br>
          Réf. Client <em>C00022</em><br>
          12 Rue de Verdun<br>
          54250 JARNY
        </div>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1 text-bold">Audits et rapports mensuels (1er Novembre 2016 - 30 Novembre 2016)</div>
      </q-card-section>

      <q-card-section>
        <q-table :rows="items" :columns="columns" row-key="description" dense separator="horizontal" />
      </q-card-section>

      <q-card-section class="row justify-end">
        <q-table :rows="totals" :columns="totalColumns" row-key="label" dense separator="none" flat />
      </q-card-section>

      <q-card-section>
        <p class="text-caption">
          En votre aimable règlement et avec nos remerciements.<br>
          Conditions de paiement : paiement à réception de facture, à 15 jours.<br>
          Aucun escompte consenti pour règlement anticipé.<br>
          Règlement par virement bancaire.<br><br>
          En cas de retard de paiement, indemnité forfaitaire pour frais de recouvrement : 40 euros (art. L.4413 et L.4416 code du commerce).
        </p>
      </q-card-section>

      <q-card-section class="text-right text-caption">
        90TECH SAS - N° SIRET 80897753200015 RCS METZ<br>
        6B, Rue aux Saussaies des Dames - 57950 MONTIGNY-LES-METZ<br>
        Code APE 6201Z - N° TVA Intracom. FR 77 808977532<br>
        IBAN FR76 1470 7034 0031 4211 7882 825 - SWIFT CCBPFRPPMTZ
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const columns = [
  { name: 'description', label: 'Description', align: 'left', field: 'description' },
  { name: 'quantite', label: 'Quantité', align: 'left', field: 'quantite' },
  { name: 'unite', label: 'Unité', align: 'left', field: 'unite' },
  { name: 'pu_ht', label: 'PU HT', align: 'right', field: 'pu_ht' },
  { name: 'tva', label: 'TVA', align: 'left', field: 'tva' },
  { name: 'total_ht', label: 'Total HT', align: 'right', field: 'total_ht' }
];

const items = ref([
  { description: 'Audits et rapports mensuels', quantite: 1, unite: 'Jour', pu_ht: '500,00€', tva: '20%', total_ht: '500,00€' },
  { description: "Génération des rapports d'activité", quantite: 4, unite: 'Rapport', pu_ht: '800,00€', tva: '20%', total_ht: '3 200,00€' }
]);

const totalColumns = [
  { name: 'label', field: 'label', align: 'left' },
  { name: 'value', field: 'value', align: 'right' }
];

const totals = ref([
  { label: 'Total HT', value: '3 700,00€' },
  { label: 'TVA 20%', value: '740,00€' },
  { label: 'Total TTC', value: '4 440,00€' }
]);
</script>
