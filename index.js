const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(express.static('build'))
app.use(cors())


morgan.token('body', (req, res) => {
    const body = req.body
    body.id = undefined
    return JSON.stringify(body)
})

app.use(morgan(':method :url :status - :res[content-length] - :response-time ms - :body'));

let persons = [
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 1
    },
    {
        "name": "Kuisma Saariluoma",
        "number": "39-23-6423122",
        "id": 2
    },
    {
        "name": "Keijo Markkanen",
        "number": "39-23-6423122",
        "id": 3
    }

]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people</br>
    ${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()

})

app.post('/api/persons/', (req, res) => {
    const body = req.body
    body.id = Math.floor(Math.random() * Math.floor(500))
    console.log(body)

    if (!body.name) {
        return res.status(400).json({
            error: "name missing"
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: "number missing"
        })
    }

    if(persons.some(person => person.name === body.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    persons = persons.concat(body)
    res.json(body)
}
)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
