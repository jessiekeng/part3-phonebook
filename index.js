require('dotenv').config() // MUST be at the top
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person') // Import the Mongoose module

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Morgan configuration
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// 3.13: Fetch all phonebook entries from the database
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons) // Formatted automatically by toJSON in the model
  })
})

// 3.2: Info page (Updated to count database entries)
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const date = new Date()
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `)
  })
})

// 3.3: Get single entry from database
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

// 3.14: Save new numbers to the database
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  // Per 3.14: We can currently ignore name uniqueness at the database level
  person.save().then(savedPerson => {
    response.json(savedPerson) // response sent only after successful save
  })
})

// 3.4: Delete entry (Placeholder for 3.15)
app.delete('/api/persons/:id', (request, response) => {
  // Logic for deletion will be implemented in Step 3.15
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})