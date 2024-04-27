// Imports
import { createServer } from "node:http";

// Create server local

const server = createServer();

server.listen(8000, "127.0.0.1", () => {
  console.log("Listen");
});
