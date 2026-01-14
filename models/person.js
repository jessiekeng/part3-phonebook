const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3, // Exercise 3.19: Name must be >= 3 characters
    required: true
  },
  number: {
    type: String,
    minLength: 8, // Exercise 3.20: Total length >= 8
    required: true,
    validate: {
      // Exercise 3.20: Custom validator for the hyphen pattern
      validator: function(v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

// Formatting logic (id conversion) remains the same
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)