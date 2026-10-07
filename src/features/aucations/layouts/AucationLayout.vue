<template>
  <div class="min-h-screen bg-slate-50">
    <NavbarComponent @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="flex">
      <SidebarComponent
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      />

      <main class="min-w-0 flex-1 p-4 md:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'

const sidebarOpen = ref(false)
</script>
