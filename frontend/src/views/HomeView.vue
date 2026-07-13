<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import GraphDisplay from '@/components/GraphDisplay.vue';
import { fetchGraphInBounds } from '@/services/graphAPI.ts';

function callApi() {
  console.log(fetchGraphInBounds(0, 0, 10, 10))
}

</script>

<template>
  <main>
    <GraphDisplay />
    <button v-on:click="callApi()">Call API</button>
  </main>
</template>
