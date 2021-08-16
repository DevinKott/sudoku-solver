const util = require('util');

const valid = obj => obj !== null && obj !== undefined;

exports.solve = (state) => {
    // Create the board
    let board = [[], [], [], [], [], [], [], [], []];
    let tracker = {
        index: 0,
        row: 0,
        col: 0
    };

    while (tracker.index < 81) {
        const num = parseInt(state[tracker.index++]);
        board[tracker.row][tracker.col] = {
            row: tracker.row,
            col: tracker.col,
            val: num > 0 ? num : undefined,
            potential: []
        };

        if (tracker.col === 8) {
            tracker.row += 1;
            tracker.col = 0;
        } else {
            tracker.col += 1;
        }
    }

    // Define some helper methods
    const isNumInRow = (curState, number, row) => curState[row].filter(cell => cell.val === number).length > 0;

    const isNumInCol = (curState, number, col) => {
        for (let r = 0; r < 9; r++) {
            if (curState[r][col].val === number) return true;
        }

        return false;
    };

    const isNumInQuad = (curState, number, row, col) => {
        let startRow = row;
        let startCol = col;
        while (startRow % 3 !== 0) startRow -= 1;
        while (startCol % 3 !== 0) startCol -= 1;

        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (curState[r][c].val === number) return true;
            }
        }

        return false;
    };

    const generatePotentials = (curState) => {
        const tempState = curState;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (tempState[r][c].val !== undefined) {
                    tempState[r][c].potential = [];
                    continue;
                }

                let found = [];
                for (let i = 1; i <= 9; i++) {
                    if (isNumInRow(tempState, i, r) || isNumInCol(tempState, i, c) || isNumInQuad(tempState, i, r, c)) {
                        found.push(i);
                    }
                }
    
                tempState[r][c].potential = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ].filter(num => !found.includes(num));
            }
        }

        return tempState;
    };

    // If we have a potential list with just 1 number, that must be the value
    const usePotentialsFirstPass = (curState) => {
        const tempState = curState;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (tempState[r][c].val !== undefined) continue; // Skip if we already have a value for this cell
                if (tempState[r][c].potential.length === 1) {
                    tempState[r][c].val = tempState[r][c].potential[0];
                    tempState[r][c].potential = [];
                }
            }
        }

        return tempState;
    };

    const usePotentialsSecondPass = (curState) => {
        
    }

    for (let i = 0; i < 10; i++) {
        board = generatePotentials(board);
        board = usePotentialsFirstPass(board);
    }

    console.log(util.inspect(board, false, null, true))
};

exports.isValid = (state) => {
    const VALID_SYMBOLS = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ]
    return valid(state) &&
        typeof(state) === 'string' &&
        state.length === 81 &&
        state.split('').filter(char => VALID_SYMBOLS.includes(char)).length === 81;
};