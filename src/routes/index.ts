import express from "express";
import adminRoute from "./admin.route";

const routes = express.Router();

routes.use("/admin", adminRoute);

export default routes;

