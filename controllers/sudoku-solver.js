class SudokuSolver {

  constructor() {
    this.count = 0
  }

  generateGrid(str) {
    const puzzle = [];
    for (let i = 0; i < 9; i++) {
      const row = Array.apply(null, Array(9).fill(0));
      for (let j = 0; j < row.length; j++) {
        const currentIndex = (i * 9) + j;
        row[j] = str[currentIndex];
      }
      puzzle.push(row);
    }
    return puzzle;
  }

  validatePuzzle(puzzleString) {
    const checkInvalidContent = /[^(1-9|.)]/;

    if (!puzzleString) {
      return { error: 'Required field missing' };
    } else if (checkInvalidContent.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    } else if (puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    return true;
  }

  validateValue(val) {
    if (!/^[1-9]$/.test(val)) {
      return { error: 'Invalid value' };
    }
    return true;
  }

  validateCoordinate(coords, puzzleString, value) {
    const puzzle = this.generateGrid(puzzleString);

    const row = coords[0];
    const col = +coords.substring(1);

    const rowIndex = this.convertRowToIndex(row);
    const colIndex = col - 1;
    const coordVal = puzzle[rowIndex][colIndex];
    const coordReg = /^[a-iA-I]\d$/gi;

    if (coordReg.test(coords) === false) {
      return { error: 'Invalid coordinate' };
    } else if (/^\.$/.test(coordVal)) {
      return true;
    } else if (coordVal == value) {
      return "filledValue";
    }
  }

  convertRowToIndex(row) {
    return row.toUpperCase().charCodeAt() - 65;
  }

  getRange(index) {
    let range = [];

    if (index <= 2) {
      range.push(0, 2);
    } else if (index > 2 && index <= 5) {
      range.push(3, 5);
    } else if (index > 5 && index <= 8) {
      range.push(6, 8);
    }
    return range;
  }

  checkRowPlacement(puzzleString, row, value) {
    const puzzle = this.generateGrid(puzzleString);
    const currentRow = /^\d$/.test(row) ? row : this.convertRowToIndex(row);
    const existingVal = puzzle[currentRow].find((e) => e == value)
    if (existingVal) {
      return "row";
    }
    return true;
  }

  checkColPlacement(puzzleString, column, value) {
    const puzzle = this.generateGrid(puzzleString);
    const colIndex = column - 1;

    for (const row of puzzle) {
      if (row[colIndex] == value) return "column";
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const puzzle = this.generateGrid(puzzleString);
    const currentRow = /^\d$/.test(row) ? row : this.convertRowToIndex(row);
    const colIndex = column - 1;

    const rowRange = this.getRange(currentRow);
    const colRange = this.getRange(colIndex);

    for (let i = rowRange[0]; i <= rowRange[1]; i++) {
      for (let j = colRange[0]; j <= colRange[1]; j++) {
        if (puzzle[i][j] == value) return "region";
      }
    }
    return true;
  }


  solve(puzzleString) {
    const puzzleArray = puzzleString.split("");
    let count = 0;

    const completing = (puzzleString) => {
      if (!puzzleString.includes('.')) {
        return { solution: puzzleString };
      }
      if (count > 5) {
        return { error: "Puzzle cannot be solved" }
      }
      for (let index = 0; index < puzzleArray.length; index++) {
        if (puzzleArray[index] != ".") continue;
        const row = Math.floor(index / 9);
        const col = index % 9 + 1;
        const options = [];

        for (let i = 1; i <= 9; i++) {
          const checkPlacement = [
            this.checkRowPlacement(puzzleArray, row, i),
            this.checkColPlacement(puzzleArray, col, i),
            this.checkRegionPlacement(puzzleArray, row, col, i)].filter(r => r !== true);
          if (checkPlacement.length != 0) continue;
          options.push(i);
        }

        if (options.length == 1) {
          puzzleArray[index] = options[0];
        }
      }
      const solution = puzzleArray.join("")
      count += 1;
      return completing(solution);
    }
    return completing(puzzleString);
  }
}

module.exports = SudokuSolver;