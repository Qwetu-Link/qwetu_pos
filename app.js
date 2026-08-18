import { createServer } from "http";
import next from "next";

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev })
const app = next({
  dev,
  hostname,
  port,
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(
      `> Qwetu POS ready on port ${port}  as ${
        dev ? "development" : process.env.NODE_ENV
      }`,
    );
  });
});
