import { Game } from ".";

/**
 * Creates a new game of Tic Tac Toe.
 * @param {string} firstPlayer - The player to start the game, either "X" or "O".
 * @returns {Game} - A new Game object initialized with the specified first player and a unique game ID.
 */

export function newGame(firstPlayer) {
  return new Game(firstPlayer, Date.now());
}

/**
 * Randomly chooses a player to go first.
 * @returns {string} - Either "X" or "O", chosen randomly.
 */
export function chooseFirstPlayer() {
  return Math.random() < 0.5 ? "X" : "O";
}

/**
 * Starts a new game of Tic Tac Toe, choosing a random player to go first.
 * @returns {Game} - A new Game object, ready to be played.
 */
export function startNewGame() {
  const firstPlayer = chooseFirstPlayer();
  const game = newGame(firstPlayer);
  return game;
}
