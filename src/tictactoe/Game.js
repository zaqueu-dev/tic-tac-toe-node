import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { currentGames } from "./newGame.js";

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
    this.isGameOver = false;
  }

  checkWinner() {
    const { board } = this;
    const lines = [
      // Rows
      { line: [board[0][0], board[0][1], board[0][2]], index: "row 0" },
      { line: [board[1][0], board[1][1], board[1][2]], index: "row 1" },
      { line: [board[2][0], board[2][1], board[2][2]], index: "row 2" },
      // Columns
      { line: [board[0][0], board[1][0], board[2][0]], index: "col 0" },
      { line: [board[0][1], board[1][1], board[2][1]], index: "col 1" },
      { line: [board[0][2], board[1][2], board[2][2]], index: "col 2" },
      // Diagonals
      { line: [board[0][0], board[1][1], board[2][2]], index: "diag 1" },
      { line: [board[0][2], board[1][1], board[2][0]], index: "diag 2" },
    ];

    for (const { line, index } of lines) {
      if (line[0] && line[0] === line[1] && line[1] === line[2]) {
        const winner = line[0];
        if (winner !== null) {
          return { winner, line: index }; // Return winner and the winning line
        }
      }
    }

    return null; // No winner yet
  }

  makeMove(position) {
    position -= 1;
    const row = Math.floor(position / 3);
    const col = position % 3;

    if (
      position < 0 ||
      position >= 9 ||
      this.board[row][col] !== null ||
      this.isGameOver
    ) {
      console.log("Movimento inválido:", position);
      return false;
    }

    this.board[row][col] = this.currentPlayer;

    const winner = this.checkWinner();
    if (winner) {
      this.isGameOver = true;
      console.log("Vencedor:", winner.winner);
    } else {
      this.currentPlayer = this.currentPlayer === 1 ? 0 : 1;
    }

    return true;
  }

  endGame() {
    const gameIndex = currentGames.findIndex(
      (game) => game.gameId === this.gameId
    );

    if (gameIndex !== -1) {
      currentGames.splice(gameIndex, 1); // Remove o jogo do array
      console.log(`Game with ID ${this.gameId} has been removed.`);
    } else {
      console.log(`Game with ID ${this.gameId} not found.`);
    }
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

  async renderBoard() {
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    const boardImagePath = path.join("public", `game_${this.gameId}.png`);

    try {
      const background = await loadImage(boardImagePath);
      ctx.drawImage(background, 0, 0, 300, 300); // desenha o fundo
    } catch (err) {
      console.error("Erro ao carregar imagem de fundo:", err);
      // Se falhar em carregar, desenha o tabuleiro manualmente
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 100);
      ctx.lineTo(300, 100);
      ctx.moveTo(0, 200);
      ctx.lineTo(300, 200);
      ctx.moveTo(100, 0);
      ctx.lineTo(100, 300);
      ctx.moveTo(200, 0);
      ctx.lineTo(200, 300);
      ctx.stroke();
    }

    const cellSize = 100;

    // Desenha os X e O
    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellSize + cellSize / 2;
        const y = rowIndex * cellSize + cellSize / 2;

        if (cell === 1) {
          ctx.beginPath();
          ctx.moveTo(x - 30, y - 30);
          ctx.lineTo(x + 30, y + 30);
          ctx.moveTo(x + 30, y - 30);
          ctx.lineTo(x - 30, y + 30);
          ctx.strokeStyle = "red";
          ctx.lineWidth = 5;
          ctx.stroke();
        } else if (cell === 0) {
          ctx.beginPath();
          ctx.arc(x, y, 30, 0, Math.PI * 2);
          ctx.strokeStyle = "blue";
          ctx.lineWidth = 5;
          ctx.stroke();
        }
      });
    });

    // Desenha a linha do vencedor, se tiver
    const winner = this.checkWinner();
    if (winner) {
      this.drawWinningLine(ctx, winner.line);
    }

    const buffer = canvas.toBuffer("image/png");
    await fs.writeFileSync(boardImagePath, buffer); // salva no mesmo arquivo
    return buffer;
  }

  /**
   * Draw a line indicating the winning combination.
   * @param {CanvasRenderingContext2D} ctx - The canvas drawing context.
   * @param {string} line - The winning line (e.g., row, column, or diagonal).
   */
  drawWinningLine(ctx, line) {
    const cellSize = 100;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "green";

    switch (line) {
      case "row 0":
        ctx.beginPath();
        ctx.moveTo(0, 50);
        ctx.lineTo(300, 50);
        break;
      case "row 1":
        ctx.beginPath();
        ctx.moveTo(0, 150);
        ctx.lineTo(300, 150);
        break;
      case "row 2":
        ctx.beginPath();
        ctx.moveTo(0, 250);
        ctx.lineTo(300, 250);
        break;
      case "col 0":
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(50, 300);
        break;
      case "col 1":
        ctx.beginPath();
        ctx.moveTo(150, 0);
        ctx.lineTo(150, 300);
        break;
      case "col 2":
        ctx.beginPath();
        ctx.moveTo(250, 0);
        ctx.lineTo(250, 300);
        break;
      case "diag 1":
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(300, 300);
        break;
      case "diag 2":
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.lineTo(300, 0);
        break;
    }
    ctx.stroke();
  }
}
