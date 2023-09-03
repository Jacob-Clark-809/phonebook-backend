const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(express.json());
app.use(morgan('tiny'));

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

function errorForPerson(person) {
  if (!person.name) {
    return 'person must have a name';
  } else if (!person.number) {
    return 'person must have a number';
  } else if (persons.some(p => p.name === person.name)) {
    return 'name must be unique';
  } else {
    return null;
  }
}

app.get('/info', (request, response) => {
  let content = `<p>Phonebook has info for ${persons.length} people</p>` +
    `<p>${new Date()}</p>`;
  
  response.send(content);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const id = Math.floor((Math.random() * 10000));

  const error = errorForPerson(body);
  if (error) {
    response.status(400).json({ error });
  } else {
    const newPerson = {
      id,
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(newPerson);
    response.json(newPerson);
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(p => p.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
