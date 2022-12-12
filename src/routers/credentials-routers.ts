import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { credentialsDelete, credentialsGet, createCredentials } from "@/controllers";

const credentialsRouter = Router();

credentialsRouter
  .all("/*", authenticateToken)
  .post("/", createCredentials)
  .get("/", credentialsGet)
  .delete("/", credentialsDelete);

export { credentialsRouter };
