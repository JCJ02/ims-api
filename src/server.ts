import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(cors());
dotenv.config();

app.use("/api", routes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
});