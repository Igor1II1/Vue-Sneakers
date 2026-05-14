const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express()

app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})


const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      price INTEGER NOT NULL,
      imageUrl TEXT NOT NULL
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      item_id INTEGER NOT NULL
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS cart (
      id SERIAL PRIMARY KEY,
      item_id INTEGER NOT NULL
    )
  `)

  const { rows } = await pool.query('SELECT COUNT(*) FROM items')
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO items (title, price, imageUrl) VALUES
      ('Nike Air Max 97', 5990, 'sneakers/sneakers-1.jpg'),
      ('Nike Blazer Mid', 8490, 'sneakers/sneakers-2.jpg'),
      ('Nike Huarache', 5490, 'sneakers/sneakers-3.jpg'),
      ('Nike Air Max 95', 9490, 'sneakers/sneakers-4.jpg'),
      ('Nike Air Jordan 1', 8990, 'sneakers/sneakers-5.jpg'),
      ('Nike Air Max 720', 10490, 'sneakers/sneakers-6.jpg'),
      ('Nike Dunk Low', 8490, 'sneakers/sneakers-7.jpg'),
      ('Nike Air Force 1', 7490, 'sneakers/sneakers-8.jpg')
    `)
  }
}



app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, title, price, imageurl AS "imageUrl" FROM items')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})



app.get('/api/favorites', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT favorites.id, items.id, items.title, items.price, items.imageurl AS "imageUrl"
      FROM favorites
      JOIN items ON favorites.item_id = items.id
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/favorites', async (req, res) => {
  try {
    const { item_id } = req.body
    const { rows } = await pool.query(
      'INSERT INTO favorites (item_id) VALUES ($1) RETURNING *',
      [item_id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/favorites/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM favorites WHERE id = $1', [id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})







app.get('/api/cart', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT cart.id, items.id, items.title, items.price, items.imageurl AS "imageUrl"
      FROM cart
      JOIN items ON cart.item_id = items.id
    `)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/cart', async (req, res) => {
  try {
    const { item_id } = req.body
    const { rows } = await pool.query(
      'INSERT INTO cart (item_id) VALUES ($1) RETURNING *',
      [item_id]
    )
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/cart/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM cart WHERE id = $1', [id])
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})





const PORT = process.env.PORT || 3000

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Ошибка инициализации БД:', err)
    process.exit(1)
  })
