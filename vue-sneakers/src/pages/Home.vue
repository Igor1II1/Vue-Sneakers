<script setup>
import { reactive, watch, ref, onMounted } from 'vue'
import CardList from '../components/CardList.vue'
import debounce from 'lodash.debounce'
import { inject } from 'vue'

const { cart, addToCart, removeFromCart } = inject('cart')
const base = import.meta.env.BASE_URL

const items = ref([])

const filters = reactive({
  sortBy: 'title',
  searchQuery: '',
})

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = debounce((event) => {
  filters.searchQuery = event.target.value
}, 300)

const addToFavorite = async (item) => {
  if (!item.isFavorite) {
    item.isFavorite = true
    const res = await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: item.id }),
    })
    const data = await res.json()
    item.favoriteId = data.id
  } else {
    item.isFavorite = false
    await fetch(`/api/favorites/${item.favoriteId}`, { method: 'DELETE' })
    item.favoriteId = null
  }
}

const fetchFavorites = async () => {
  const res = await fetch('/api/favorites')
  const favorites = await res.json()
  items.value = items.value.map((item) => {
    const favorite = favorites.find((f) => f.id === item.id)
    if (!favorite) return item
    return { ...item, isFavorite: true, favoriteId: favorite.id }
  })
}

let allItems = []

const fetchItems = async () => {
  try {
    if (allItems.length === 0) {
      const res = await fetch('/api/items')
      allItems = await res.json()
    }

    let filtered = [...allItems]

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase()
      filtered = filtered.filter((item) => item.title.toLowerCase().includes(q))
    }

    if (filters.sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === '-price') {
      filtered.sort((a, b) => b.price - a.price)
    } else {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    }

    items.value = filtered.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false,
    }))
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  await fetchItems()
  await fetchFavorites()
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }))
})

watch(cart, () => {
  items.value = items.value.map((item) => ({
    ...item,
    isAdded: cart.value.some((cartItem) => cartItem.id === item.id),
  }))
})

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
            <img class="absolute left-3 top-3" :src="`${base}search.svg`" />
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