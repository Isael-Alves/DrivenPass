import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { 
  credentialsDelete,
  getCredential, 
  createCredentials, 
  getAllCredentials 
} from "@/controllers";

const credentialsRouter = Router();

credentialsRouter
  .all("/*", authenticateToken)
  .post("/", createCredentials)
  .get("/:credentialId", getCredential)
  .get("/", getAllCredentials)
  .delete("/:credentialId", credentialsDelete);

export { credentialsRouter };
