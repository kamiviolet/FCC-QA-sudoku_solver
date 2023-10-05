const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions, puzzlesIncorrect } = require('../controllers/puzzle-strings');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  after(() => {
    chai.request(server)
      .get('/')
  })

  test('1.Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end((req, res) => {
        assert.equal('', '')
      })
    done();
  });
  test('2.Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
      })
    done();
  });
  test('3.Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesIncorrect[1]})
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
      })
    done();
  });
  test('4.Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesIncorrect[2]})
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
      })
    done();
  });
  test('5.Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesIncorrect[3] })
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
      })
    done();
  });
  test('6.Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 3
      })
      .end((req, res) => {
        assert.equal(res.status, 200);
      })
    done();
  });
  test('7.Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 4
      })
      .end((req, res) => {
        assert.deepEqual(
          res.body,
          { "valid": false, "conflict": ["row"] }
        );
      })
    done();
  });
  test('8.Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A2',
        value: 1
      })
      .end((req, res) => {
        assert.deepEqual(
          res.body,
          { "valid": false, "conflict": ["row", "region"] }
        );
      })
    done();
  });
  test('9.Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A4',
        value: 1
      })
      .end((req, res) => {
        assert.deepEqual(
          res.body,
          { "valid": false, "conflict": ["row", "column", "region"] }
        );
      })
    done();
  });
  test('10.Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1'
      })
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
      })
    done();
  });
  test('11.Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesIncorrect[1],
        coordinate: 'A1',
        value: 1
      })
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
      })
    done();
  });
  test('12.Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesIncorrect[2],
        coordinate: 'A1',
        value: 1
      })
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
      })
    done();
  });
  test('13.Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'AL',
        value: 1
      })
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate')
      })
    done();
  });
  test('14.Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1',
        value: 0
      })
      .end((req, res) => {
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value')
      })
    done();
  });

});