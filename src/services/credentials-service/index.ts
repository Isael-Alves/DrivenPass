import { conflictError } from "@/errors";
import { CreatCredentialType } from "@/protocols";
import credentialRepository from "@/repositories/credentials-repository";
import { encrypt } from "@/utils/criptrUtils";

async function createCredential(userId: number, credential: CreatCredentialType) {
  const checkExistingCredential = await credentialRepository.getCredentialByTitle(userId, credential.title);
  if (checkExistingCredential) throw conflictError("Title already in use");

  const credentialInfos = {
    ...credential,
    password: encrypt(credential.password),
  };

  await credentialRepository.insertCredential(userId, credentialInfos);
}

const credentialService = {
  createCredential,
};

export default credentialService;
