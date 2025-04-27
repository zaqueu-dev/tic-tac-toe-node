import { createServer } from "http";
import { parse } from "url";
import { startNewGame } from "../tictactoe/newGame.js";
import { currentGames } from "../tictactoe/newGame.js";
import "dotenv/config";

const PORT = process.env.PORT || 8080;

const server = createServer(async (req, res) => {
  const pathname = parse(req.url).pathname;
  console.log(pathname);

  if (pathname === "/newGame" && req.method === "GET") {
    res.writeHead(200, { "content-type": "application/json" });
    const newGame = await startNewGame();
    console.log(JSON.stringify(newGame));
    res.end(JSON.stringify(newGame));
  } else if (pathname === "/makeMove" && req.method === "PUT") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      const data = JSON.parse(body);
      const { gameId, position } = data;

      const game = currentGames.find((element) => element.gameId === gameId);
      game.makeMove(position);
    });
  }
});

server.listen(PORT, () => {
  console.log("Servidor rodando na porta ", PORT);
});
