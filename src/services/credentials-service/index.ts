import { conflictError, notFoundError } from "@/errors";
import { CreatCredentialType } from "@/protocols";
import credentialRepository from "@/repositories/credentials-repository";
import { decrypt, encrypt } from "@/utils/criptrUtils";
import { User } from "@prisma/client";

async function createCredential(userId: number, credential: CreatCredentialType) {
  const checkExistingCredential = await credentialRepository.getCredentialByTitle(userId, credential.title);
  if (checkExistingCredential) throw conflictError("Title already in use");

  const credentialInfos = {
    ...credential,
    password: encrypt(credential.password),
  };

  await credentialRepository.insertCredential(userId, credentialInfos);
}

async function getCredential(userId: number, credentialId: number) {
  const checkCredentialExist = await credentialRepository.getCredential(
    userId,
    credentialId
  );
  if (!checkCredentialExist) throw notFoundError();

  return {
    ...checkCredentialExist,
    password: decrypt(checkCredentialExist.password)
  };
}

async function getAllCredentials(userId: number) {
  const credentials = await credentialRepository.getAllCredential(userId);
  return credentials.map(credential => {
    const { password } = credential;
    return { ...credential, password: decrypt(password) };
  });
}

async function deleteCredential(userId: number, credentialId: number) {
  await getCredential(userId, credentialId);
  await credentialRepository.deleteCredential(credentialId);
}

const credentialService = {
  createCredential,
  getCredential,
  getAllCredentials,
  deleteCredential
};

export default credentialService;
