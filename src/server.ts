import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api", routes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
});