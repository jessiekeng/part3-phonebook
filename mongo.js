const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// MongoDB Atlas connection string (replace 'your-cluster-url' with your actual Atlas URL)
const url = `mongodb+srv://fullstack:${password}@cluster0.jpvdcoy.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Logic for LISTING all entries
if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => { 
    // Here 'result' IS used for the forEach, so keep it!
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

// Logic for ADDING a new entry
if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => { // Changed 'result' to '()'
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}