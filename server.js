/* eslint-disable no-path-concat, no-console */

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const checkParams = require('./utils/checkParams');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

app.set('port', process.env.NODE_ENV || 3000);

app.listen(app.get('port'), () => {
  console.log(`Server is running on ${app.get('port')}`);
});

app.get('/api/v1/garage_items', (request, response) => {
  database('garage_items').select()
    .then((garageItems) => {
      response.status(200).json(garageItems);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/garage_items', (request, response) => {
  const item = request.body;

  checkParams(['item_name', 'reason', 'cleanliness'], item, response);

  database('garage_items').insert(item, 'id')
    .then((id) => {
      response.status(201).json({ id });
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/garage_items/:id', (request, response) => {
  const { cleanliness } = request.body;
  const { id } = request.params;

  database('garage_items').where({ id }).update({ cleanliness })
    .then((update) => {
      if (!update) {
        response.sendStatus(404);
      }
      response.sendStatus(204);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

module.exports = app;
