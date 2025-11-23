<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'
import debounce from 'lodash.debounce'
import axios from 'axios'
import { inject } from 'vue'

const { cart, addToCart, removeFromCart} = inject('cart')

const items = ref([])


const filters = reactive({
  sortBy: 'title',
  searchQuery: '',
})


// добавление и удаление товара из массива
const onClickAddPlus = (item)=>{
 if(!item.isAdded){
addToCart(item)
 }else{
  removeFromCart(item)
 }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

// отвечает за поиск
const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
},300)


const addToFavorite = async(item)=>{
    try{
      if(!item.isFavorite){
        const obj ={
        item_id: item.id,
      };

      item.isFavorite=true;

      const { data } = await axios.post(`https://212518633187bd46.mokky.dev/favorites`, obj)
      
     item.favoriteId= data.id;
      } else{
        item.isFavorite = false;
        
        await axios.delete(`https://212518633187bd46.mokky.dev/favorites/${item.favoriteId}`)
        item.favoriteId = null;
        
      }
    } catch(err){
      console.log(err)
    }
  }


  onMounted(async () => {
  const localCart = localStorage.getItem('cart')
  cart.value = localCart ? JSON.parse(localCart) : []

 

  // запрос всех кросовок
  await fetchItems()
  // получение всех закладок
  await fetchFavorites()

   // при перезагрузке страницы сохранять зеленые галочки
  items.value = items.value.map((item)=>({
    ...item,
    isAdded:cart.value.some((CartItem) => CartItem.id ===item.id)
  }))
})


// watch — это функция во Vue, 
// которая позволяет следить за изменениями какой-то 
// переменной (reactive или ref) и выполнять код, когда она меняется.
// Проще говоря:
// watch = “слежка за данными: если они изменились — сделай что-то”
watch(cart, ()=>{
  items.value = items.value.map((item)=>({
    ...item,
    isAdded: false
  }))
})



  const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(`https://212518633187bd46.mokky.dev/favorites`)
    items.value = items.value.map((item) => {
      const favorite = favorites.find((favorite) => favorite.item_id === item.id)

      if (!favorite) {
        return item
      }
      return {
        ...item,
        // состояние добавления товара
        isFavorite: true,
        favoriteId: favorite.id,
      }
    })
    // console.log(items.value)
  } catch (err) {
    console.log(err)
  }
}


const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    }
    if (filters.searchQuery) {
      params.title = `*${filters.searchQuery}*`
    }
    const { data } = await axios.get(`https://212518633187bd46.mokky.dev/items`, {
      params,
    })

    items.value = data.map((obj) => ({
      // копирует свойство объекта
      ...obj,
      // добавляет новое свойство
      isFavorite: false,
      favoriteId:null,
      // добавляет еще одно свойство
      isAdded: false,
    }))
  } catch (err) {
    console.log(err)
  }
}


watch(filters, fetchItems)

</script>



<template>
    <div>
    <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>
        <div class="flex gap-4">
          <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
            <option value="name">По названию</option>
            <option value="price">По цене (дешевые)</option>
            <option value="-price">По цене (дорогие)</option>
          </select>

          <div class="relative">
            <img class="absolute left-3 top-3" src="/search.svg" />
            <input
              @input="onChangeSearchInput"
              class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
              placeholder="Поиск..."
            />
          </div>
        </div>
      </div>

      <div class="mt-10">
        <CardList :items="items" @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" />
      </div>
      </div>
</template>