import fs from "node:fs";
import path from "node:path";

import cors from "cors";
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

import messages from "./data/messages.json";
import openApiDocument from "./openapi.json";

type LoseMessage = {
  id: string;
  category: string;
  message: string;
};

const app = express();
const host = process.env.HOST ?? "127.0.0.1";
const port = Number(process.env.PORT ?? 3000);
const apiName = "lose-as-a-service";
const clientDistPath = path.resolve(process.cwd(), "web/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173"
    ]
  })
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/openapi.json", (_request: Request, response: Response) => {
  response.json(openApiDocument);
});

const pickRandomMessage = (pool: LoseMessage[]): LoseMessage =>
  pool[Math.floor(Math.random() * pool.length)];

app.get("/", (_request: Request, response: Response) => {
  response.json({
    name: apiName,
    status: "ok",
    message: "Perdi o Jogo. Agora voce tambem.",
    docs: "/docs"
  });
});

app.get("/perdi", (request: Request, response: Response) => {
  const category = typeof request.query.category === "string" ? request.query.category : undefined;
  const filteredMessages = category
    ? messages.filter((entry) => entry.category === category)
    : messages;

  if (filteredMessages.length === 0) {
    response.status(404).json({
      error: `No messages found for category: ${category}`
    });
    return;
  }

  response.json(pickRandomMessage(filteredMessages));
});

if (fs.existsSync(clientIndexPath)) {
  app.use("/app", express.static(clientDistPath));
  app.get("/app", (_request: Request, response: Response) => {
    response.sendFile(clientIndexPath);
  });
}

app.listen(port, host, () => {
  console.log(`lose-as-a-service listening on http://${host}:${port}`);
});
