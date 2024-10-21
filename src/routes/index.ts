import express from "express";
import adminRoute from "./AdminRoute";
import roleRoute from "./RoleRoute";
import mentorRoute from "./MentorRoute";
import internRoute from "./InternRoute";

const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/role", roleRoute);
routes.use("/mentor", mentorRoute);
routes.use("/intern", internRoute);

export default routes;

