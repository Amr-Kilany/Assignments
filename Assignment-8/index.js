import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./src/config/dot.env") });

import express from "express";
import { bootstrap } from "./src/app.controller.js";

const app = express();
const PORT = process.env.PORT || 80;
bootstrap(app, express);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
