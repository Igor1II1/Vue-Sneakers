<script setup>
import { provide, ref, computed, onMounted } from 'vue'
import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

const cart = ref([])
const drawerOpen = ref(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))
const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100))

const closeDrawer = () => { drawerOpen.value = false }
const openDrawer = () => { drawerOpen.value = true }

const addToCart = async (item) => {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item_id: item.id }),
  })
  const data = await res.json()
  item.cartId = data.id
  item.isAdded = true
  cart.value.push(item)
}

const removeFromCart = async (item) => {
  await fetch(`/api/cart/${item.cartId}`, { method: 'DELETE' })
  item.isAdded = false
  cart.value.splice(cart.value.indexOf(item), 1)
}

onMounted(async () => {
  const res = await fetch('/api/cart')
  cart.value = await res.json()
})

provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
})
</script>

<template>
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />
    <div class="p-10">
      <router-view></router-view>
      <Drawer v-if="drawerOpen" :total-price="totalPrice" :vat-price="vatPrice" />
    </div>
  </div>
</template>

<style scoped></style>
