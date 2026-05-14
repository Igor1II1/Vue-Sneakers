<script setup>
import { ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'

const favorites = ref([])

onMounted(async () => {
  try {
    const res = await fetch('/api/favorites')
    favorites.value = await res.json()
  } catch (err) {
    console.log(err)
  }
})
</script>



<template>
    <div>
    <h2 class="text-3xl font-bold mb-8">Мои закладки</h2>
    <CardList :items="favorites" is-favorites />
    </div>
</template>
