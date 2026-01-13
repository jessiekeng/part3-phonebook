const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist')) // Step 3.11: Serve frontend production build

// Step 3.8*: Custom Morgan token to log POST request body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { "id": "1", "name": "Arto Hellas", "number": "040-123456" },
    { "id": "2", "name": "Ada Lovelace", "number": "39-44-5323523" },
    { "id": "3", "name": "Dan Abramov", "number": "12-43-234345" },
    { "id": "4", "name": "Mary Poppendieck", "number": "39-23-6423122" }
]

// 3.1 & 3.9: Get all entries
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2: Info page
app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// 3.3: Get single entry
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({ error: 'person not found' })
  }
})

// 3.4: Delete entry
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

// 3.5 & 3.6: Add entry with error handling
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const nameExists = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: String(Math.floor(Math.random() * 1000000)), // Step 3.5: Large random ID
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})