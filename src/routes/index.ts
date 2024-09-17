import express from "express";
import adminRoute from "./AdminRoute";

const routes = express.Router();

routes.use("/admin", adminRoute);

export default routes;

