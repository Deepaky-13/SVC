import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//*------------- Routes ------------*//
import initDatabase from "./db/init.js";
import settingsRoutes from "./routes/settingsRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

initDatabase();

app.use("/api/v1/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
