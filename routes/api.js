'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      if (!puzzle || !coordinate || (!value && value !== 0)) {
        return res.send({ error: 'Required field(s) missing' })
      }

      const row = coordinate[0];
      const col = +coordinate.substring(1);

      const validatedPuzzle = solver.validatePuzzle(puzzle);

      if (validatedPuzzle !== true) {
        return res.send(validatedPuzzle);
      }

      const validatedVal = solver.validateValue(value);
      if (validatedVal !== true) {
        return res.send(validatedVal);
      }

      const validatedCoord = solver.validateCoordinate(coordinate, puzzle, value);

      if (validatedCoord !== true) {
        if (validatedCoord == 'filledValue') {
          return res.send({ valid: true })
        } else {
          return res.send({ error: "Invalid coordinate" });
        }
      }

      const checkPlacement = [
        solver.checkRowPlacement(puzzle, row, value),
        solver.checkColPlacement(puzzle, col, value),
        solver.checkRegionPlacement(puzzle, row, col, value),
      ].filter(r => r !== true);

      if (checkPlacement.length) {
        return res.send({
          valid: false,
          conflict: checkPlacement
        })
      } else {
        return res.send({ valid: true })
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      const validatedPuzzle = solver.validatePuzzle(puzzle);

      if (validatedPuzzle !== true) {
        return res.send(validatedPuzzle);
      } else {
        const result = solver.solve(puzzle);
        return res.send(result);
      }
    });
};
