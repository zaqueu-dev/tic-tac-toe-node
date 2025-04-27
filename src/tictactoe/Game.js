export class Game {
  /**
   * Constructor for a Game object.
   * @param {string} firstPlayer - The player to start the game, either "X" or "O".
   * @param {number} gameId - A unique identifier for the game.
   * @returns {Game} - A new Game object initialized with the specified first player and a unique game ID.
   */
  constructor(firstPlayer, gameId) {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.gameId = gameId;
    this.currentPlayer = firstPlayer; // X = 1 ; O = 0
    this.base64 = "";
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
  async makeMove(position) {
    const { board } = this;
    row = Math.floor(position / 3);
    col = position % 3;
    if (!this.isFull) {
      if (board[row][col] === null) {
        board[row][col] = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 1 ? 0 : 1;

        const imagePath = path.join(
          path.dirname(fileURLToPath(import.meta.url)),
          "../../assets/board.png"
        );
        const { base64 } = await processGameImage(imagePath, this.gameId);
        this.base64 = base64;

        return true; // Move was successful
      }
    }
    return false; // Move was not successful (cell already occupied)
  }
  endGame() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }
  isFull() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === null) {
          return false; // Found an empty cell
        }
      }
    }
    return true; // No empty cells found
  }
  getGameState() {
    return {
      board: this.board,
      firstPlayer: this.firstPlayer,
      secondPlayer: this.secondPlayer,
      gameId: this.gameId,
    };
  }
  getGameStateString() {
    return JSON.stringify(this.getGameState());
  }
}
