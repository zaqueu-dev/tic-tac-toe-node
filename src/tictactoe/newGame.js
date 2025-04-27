import { fileURLToPath } from "url";
import { Game } from "./Game.js";
import { processGameImage } from "./processImage.js";
import path from "path";

export const currentGames = [];

/**
 * Starts a new game of Tic Tac Toe, choosing a random player to go first.
 * @returns {Game} - A new Game object, ready to be played.
 */
export async function startNewGame() {
  const firstPlayer = chooseFirstPlayer();
  const game = new Game(firstPlayer, 123 /* Date.now() */);
  currentGames.push(game);

  const imagePath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../assets/board.png"
  );
  const { base64 } = await processGameImage(imagePath, game.gameId);
  game.base64 = base64;

  console.log(`New game created with ID ${game.gameId}`);
  return game;
}

/**
 * Randomly chooses a player to go first.
 * @returns {string} - Either "X" or "O", chosen randomly.
 */
export function chooseFirstPlayer() {
  return Math.random() < 0.5 ? 1 : 0;
}
