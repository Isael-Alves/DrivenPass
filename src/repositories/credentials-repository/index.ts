import { prisma } from "@/config";
import { CreatCredentialType } from "@/protocols";

async function insertCredential(userId: number, credential: CreatCredentialType) {
  return prisma.credential.create({
    data: {
      userId,
      ...credential,
    },
  });
}

async function getCredentialByTitle(userId: number, title: string) {
  return prisma.credential.findFirst({
    where: { userId, title },
  });
}

const credentialRepository = {
  insertCredential,
  getCredentialByTitle
};

export default credentialRepository;
