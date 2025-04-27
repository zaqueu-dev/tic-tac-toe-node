import { createServer } from "http";
import { parse } from "url";
import { startNewGame } from "../tictactoe/newGame.js";
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
  }
});

server.listen(PORT, () => {
  console.log("Servidor rodando na porta ", PORT);
});
