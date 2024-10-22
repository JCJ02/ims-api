import express from "express";
import adminRoute from "./AdminRoute";
import roleRoute from "./RoleRoute";
import internRoute from "./InternRoute";
import mentorRoute from "./MentorRoute";

const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/role", roleRoute);
routes.use("/mentor", mentorRoute);
routes.use("/intern", internRoute);
routes.use("/mentor", mentorRoute);

export default routes;

