const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.NODE_ENV || 3000)

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`);
});

app.get('/api/v1/garage_items', (request, response) => {
  database('garage_items').select()
    .then(garageItems => {
      response.status(200).json(garageItems)
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = app;
