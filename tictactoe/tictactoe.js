export class Game {
  constructor(firstPlayer, gameId) {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.gameId = gameId;
    this.firstPlayer = firstPlayer; // firstPlayer = X or O
    this.secondPlayer = firstPlayer === "X" ? "O" : "X";
  }

  checkWinner() {
    const { board } = this;
    const lines = [
      // Rows
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      // Columns
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      // Diagonals
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const line of lines) {
      if (line[0] && line[0] === line[1] && line[1] === line[2]) {
        return line[0]; // Returns the winner ("X" or "O")
      }
    }

    return null; // No winner yet
  }

  makeMove(position, player) {
    const { board } = this;
    row = Math.floor(position / 3);
    col = position % 3;
    if (board[row][col] === null) {
      board[row][col] = player;
      return true; // Move was successful
    }
    return false; // Move was not successful (cell already occupied)
  }
}
