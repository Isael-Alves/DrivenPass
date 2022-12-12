import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { credentialsDelete, getCredential, createCredentials } from "@/controllers";

const credentialsRouter = Router();

credentialsRouter
  .all("/*", authenticateToken)
  .post("/", createCredentials)
  .get("/:credentialId", getCredential)
  .delete("/", credentialsDelete);

export { credentialsRouter };
