import express, { Request, Response } from "express";
import notesRoutes from "./routes/notesRoutes";
import bodyParser from "body-parser";
import { purgeDb } from "./database";

const app = express();
const port = 8080;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.post('*', bodyParser.json())
app.delete('*', bodyParser.json())
app.use('/api', notesRoutes)

// Make sure all file names in db are accesable in the filesystem
purgeDb();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
