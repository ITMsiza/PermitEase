import * as functions from "firebase-functions";
import { https } from "firebase-functions";
import next from "next";

const dev = process.env.NODE_ENV !== "production";

const app = next({
  dev,
  // Your Next.js build directory
  conf: { distDir: "../.next" },
});

const handle = app.getRequestHandler();

export const nextServer = functions.https.onRequest((req, res) => {
  return app.prepare().then(() => handle(req, res));
});
