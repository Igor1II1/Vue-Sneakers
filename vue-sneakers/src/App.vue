<script setup>

import {  provide, ref, watch , computed} from 'vue'

import Header from './components/Header.vue'
import Drawer from './components/Drawer.vue'

// axios — библиотека для запросов на backend.

// ref — создаёт реактивную переменную.

// provide — позволяет передавать данные вниз по дереву компонентов.

// watch — следит за изменениями.

// computed — вычисляемые значения.



// корзина начало
const cart = ref([])


const drawerOpen =ref(false);

const totalPrice = computed(
  ()=>cart.value.reduce((acc, item)=> acc + item.price, 0)
)

const vatPrice = computed(()=>Math.round((totalPrice.value * 5) / 100))






const closeDrawer = () =>{
  drawerOpen.value = false
}

const openDrawer = () =>{
  drawerOpen.value = true
}

// Добавляет товар в массив cart.
// Помечает, что товар добавлен.
const addToCart =(item)=>{
  cart.value.push(item)
  item.isAdded =true
}

// Удаляет товар из массива.
// Снимает отметку "добавлен".
const removeFromCart=(item)=>{
  cart.value.splice(cart.value.indexOf(item) ,1)
  item.isAdded =false
}

// конец корзины

// сохранение товаров в localstorage
watch(cart, ()=>{
  localStorage.setItem('cart', JSON.stringify(cart.value))
},
{
  deep: true
}
)
provide('cart', {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
});

</script>
<template>
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />
    <div class="p-10">
      <!-- здесь мы будем рендерить все страницы  <router-view></router-view>-->
      <router-view></router-view>

  <Drawer v-if="drawerOpen" :total-price="totalPrice" :vat-price="vatPrice" />
      
    </div>
  </div>
</template>
<style scoped></style>
