/* eslint-disable */

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/not-a-route')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(err => {
      throw err;
    });
  });
});

describe('API routes', () => {

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch((error) => { throw error; })
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch((error) => { throw error; })
  });

  describe('GET /api/v1/garage_items', () => {
    it('should return all garage items', () => {
      return chai.request(server)
      .get('/api/v1/garage_items')
      .then((response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('item_name');
        response.body[0].should.have.property('reason');
        response.body[0].should.have.property('cleanliness');
        response.body.includes('lawnmower')
        response.body.includes('lawn maintenence')
        response.body.includes('dusty')
      })
    });

    it('should return a 404 error if path is incorrect', () => {
      return chai.request(server)
        .get('/api/v1/garage-items')
        .then((response) => {
          response.should.have.status(404)
        })
        .catch((error) => { throw error; })
    });
  });

  describe('POST /api/v1/garage_items', () => {
    it('should add an item to garage items table', (done) => {
      chai.request(server)
        .post('/api/v1/garage_items')
        .send({
          item_name: 'canoe',
          reason: 'hitting the lake',
          cleanliness: 'sparkling'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.have.property('id');
          chai.request(server)
            .get('/api/v1/garage_items')
            .end((error, response) => {
              response.body.should.be.a('array');
              response.body.length.should.equal(4);
              done();
            })
        })
    });

    it('should not add a new item if required parameter is missing', () => {
      chai.request(server)
        .post('/api/v1/garage_items')
        .send({
          item_name: 'recycling bin'
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
    });
  });
});
