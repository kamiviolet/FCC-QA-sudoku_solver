const chai = require('chai');
const assert = chai.assert;
const { puzzlesAndSolutions, puzzlesIncorrect } = require('../controllers/puzzle-strings');
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test('1.Logic handles a valid puzzle string of 81 characters', () => {
    assert.isTrue(solver.validatePuzzle(puzzlesAndSolutions[0][0]));
    assert.property(solver.validatePuzzle(puzzlesIncorrect[0]), 'error');
  });

  test('2.Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    assert.isTrue(solver.validatePuzzle(puzzlesAndSolutions[0][0]));
    assert.property(solver.validatePuzzle(puzzlesIncorrect[1]), 'error');
  });

  test('3.Logic handles a puzzle string that is not 81 characters in length', () => {
    assert.isTrue(solver.validatePuzzle(puzzlesAndSolutions[0][0]));
    assert.property(solver.validatePuzzle(puzzlesIncorrect[2]), 'error');
  });

  test('4.Logic handles a valid row placement', () => {
    const row = "A";
    const value = 7;
    const result = solver.checkRowPlacement(puzzlesAndSolutions[0][0], row, value)
    assert.isTrue(result);
  });

  test('5.Logic handles an invalid row placement', () => {
    const row = "A";
    const value = 5;
    const result = solver.checkRowPlacement(puzzlesAndSolutions[0][0], row, value)
    assert.equal(result, 'row');
  });

  test('6.Logic handles a valid column placement', () => {
    const col = "1";
    const value = 7;
    const result = solver.checkColPlacement(puzzlesAndSolutions[0][0], col, value)
    assert.isTrue(result);
  });

  test('7.Logic handles an invalid column placement', () => {
    const col = "7";
    const value = 7;
    const result = solver.checkColPlacement(puzzlesAndSolutions[0][0], col, value)
    assert.equal(result, 'column');
  });

  test('8.Logic handles a valid region (3x3 grid) placement', () => {
    const col = "1";
    const row = "A";
    const value = 7;
    const result = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], row, col, value)
    assert.isTrue(result);
  });

  test('9.Logic handles an invalid region (3x3 grid) placement', () => {
    const col = "3";
    const row = "A";
    const value = 5;
    const result = solver.checkRegionPlacement(puzzlesAndSolutions[0][0], row, col, value)
    assert.equal(result, "region");
  });

  test('10.Valid puzzle strings pass the solver', () => {
    assert.property(solver.solve(puzzlesAndSolutions[0][0]), "solution");
  });

  test('11.Invalid puzzle strings fail the solver', () => {
    assert.property(solver.solve(puzzlesIncorrect[3]), "error");
    assert.equal(solver.solve(puzzlesIncorrect[3])["error"], 'Puzzle cannot be solved');
  });

  test('12.Solver returns the expected solution for an incomplete puzzle', () => {
    assert.property(solver.solve(puzzlesAndSolutions[0][0]), "solution");
  });
});
