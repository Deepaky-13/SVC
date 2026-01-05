import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

//*------------- Routes ------------*//
import initDatabase from "./db/init.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import purchaseRoutes from "./routes/purchaseRouter.js";
import stockRoutes from "./routes/stockRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

initDatabase();

app.use(
  session({
    name: "svc.sid",
    secret: "svc_billing_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // keep false for local / offline
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use("/api/v1/settings", settingsRoutes);

app.use("/api/v1/role-permissions", roleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/purchases", purchaseRoutes);
app.use("/api/v1/stock", stockRoutes);
app.use("/api/v1/sales", salesRoutes);
app.use("/api/v1/services", serviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
