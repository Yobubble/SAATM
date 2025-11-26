import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./src/router.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.get("/", (req, res) => {
    res.json({
        message: "🚀 API server is running!",
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
