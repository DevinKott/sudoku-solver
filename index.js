const CommandLineArgs = require('command-line-args');

const { isValid, solve } = require('./src/board');

const optionDefinitions = [
    { name: 'board', alias: 'b', type: String },
    { name: 'debug', alias: 'd', type: Boolean },
    { name: 'help', alias: 'h' }
];

const main = async () => {
    const options = CommandLineArgs(optionDefinitions);
    const validArgs = options.help || (options.board);

    if (!validArgs) {
        console.error(`You must supply the required arguments to start the program.`);
        return;
    }

    const board = options.board;
    if (!isValid(board)) {
        console.error(`Invalid initial board state. Please supply a board state that is 81 characters long, using only the digits 0 through 9 (0 is empty).`);
        return;
    }

    const finishedBoard = solve(board);
    console.log(`Solved\n\t${finishedBoard}`);
};

main();