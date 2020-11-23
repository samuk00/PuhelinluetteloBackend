require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('body', (req) => {
    const body = req.body
    body.id = undefined
    return JSON.stringify(body)
})

app.use(morgan(':method :url :status - :res[content-length] - :response-time ms - :body'))

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
        .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
    Person.find({}).then(persons => {
        res.send(`Phonebook has info for ${persons.length} people</br>${new Date()}`)
    })
        .catch(error => next(error))

})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        res.json(person)
    })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndRemove(id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))

})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save().then(savedPerson => {
        res.json(savedPerson)
    })
        .catch(error => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message })
            }
            next(error)
        })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    
    Person.findByIdAndUpdate(req.params.id, {number: body.number}, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message })
            }
            next(error)
        })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
