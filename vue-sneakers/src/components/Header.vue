<script setup>

defineProps({
  totalPrice:Number
})

const emit = defineEmits(["openDrawer"])


</script>

<template>
  <div>
   
    <header class="flex justify-between border-b border-slate-200 px-10 py-8">
     
     <RouterLink to="/"><div class="flex items-center gap-4">
        <img src="/logo.png" alt="logo" class="w-10" />
        <div>
          <h2 class="text=xl font-bold uppercase">Vue Sneakers</h2>
          <p class="text-slate-400">Магазин лучших кроссовок</p>
        </div>
      </div></RouterLink>
    
      
      

      <ul class="flex items-center gap-10">
        <li @click="()=>emit('openDrawer')" class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
          <img src="/cart.svg" alt="Cart" />
          <b>{{ totalPrice }} руб.</b>
        </li>

       <router-link to="/favorites">
         <li class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
          <img src="/heart.svg" alt="Cart" />
          <span>Закладки</span>
        </li>
       </router-link>

        <li class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black">
          <img src="/profile.svg" alt="Cart" />
          <span>Профиль</span>
        </li>
      </ul>
    </header>
  </div>
</template>
