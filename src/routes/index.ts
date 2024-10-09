import express from "express";
import adminRoute from "./AdminRoute";
import roleRoute from "./RoleRoute";

const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/role", roleRoute);

export default routes;

