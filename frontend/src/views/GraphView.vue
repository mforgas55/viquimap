<script setup lang="ts">
import GraphDisplay from '@/components/GraphDisplay.vue'
</script>

<template>
  <div class="graph-view">
    <header class="graph-view__header">
      <div>
        <p class="graph-view__eyebrow">Visualització gràfica de la Viquipèdia</p>
        <h1 class="graph-view__title">Viquimapa</h1>
      </div>
    </header>

    <main class="graph-view__stage">
      <div class="graph-view__panel">
        <GraphDisplay />
        <br>
        <p>Viquimapa és un projecte creat amb la finalitat de mostrar visualment les connexions entre tots els articles de la Viquipèdia. <br><br>Les dades estan extretes d'un wikidump del juny del 2026.</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.graph-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0b0d16;
  color: #c9cfe8;
  font-family: system-ui, -apple-system, sans-serif;
}

.graph-view__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 24px 32px;
}

.graph-view__eyebrow {
  margin: 0 0 4px;
  font-family: ui-monospace, 'Fira Code', monospace;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6d8bff;
}

.graph-view__title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #f2f3fb;
}

/* Centers the graph panel both horizontally and vertically */
.graph-view__stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 32px 32px;
  min-height: 0;
}

.graph-view__panel {
  width: 100%;
  height: 100%;
  max-width: 1100px;
  border: 1px solid #1c2036;
  border-radius: 10px;
  overflow: hidden;
}

p {
  padding: 5px;
}
</style>