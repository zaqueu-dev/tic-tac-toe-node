import { createServer } from "http";
import { parse } from "url";
import { startNewGame } from "../tictactoe/newGame.js";
import { currentGames } from "../tictactoe/newGame.js";
import "dotenv/config";

const PORT = process.env.PORT || 8080;

const server = createServer(async (req, res) => {
  const pathname = parse(req.url).pathname;

  if (pathname === "/newGame" && req.method === "GET") {
    res.writeHead(200, { "content-type": "application/json" });
    const newGame = await startNewGame();
    res.end(JSON.stringify(newGame));
  } else if (pathname === "/makeMove" && req.method === "PUT") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { gameId, position } = data;

        if (gameId === undefined || position === undefined) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(
            JSON.stringify({ error: "Missing gameId or position" })
          );
        }

        const game = currentGames.find((element) => element.gameId === gameId);

        if (!game) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Game not found" }));
        }

        const moveResult = game.makeMove(position);

        if (moveResult) {
          const boardImageBuffer = await game.renderBoard();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          return res.end(
            JSON.stringify({
              message: "Move made successfully",
              boardImage: boardImageBuffer.toString("base64"),
              game: game.getGameState(),
            })
          );
        } else {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Invalid move" }));
        }
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "Invalid request body" }));
      }
    });
  } else if (pathname === "/endGame" && req.method === "PUT") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const { gameId } = data;

        if (gameId === undefined) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Missing gameId" }));
        }

        const game = currentGames.find((element) => element.gameId === gameId);

        if (!game) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          return res.end(JSON.stringify({ error: "Game not found" }));
        }

        game.endGame();

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        return res.end(
          JSON.stringify({
            message: "Game ended successfully",
            game: game.getGameState(),
          })
        );
      } catch (error) {
        console.error("Error parsing request body:", error);
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify({ error: "Invalid request body" }));
      }
    });
  }
});

server.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
