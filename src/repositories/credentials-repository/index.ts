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

async function getCredential(userId: number, credencialId: number) {
  return prisma.credential.findFirst({
    where: {
      userId,
      id: credencialId
    }
  });
}

async function getAllCredential(userId: number) {
  return prisma.credential.findMany({
    where: { userId }
  });
}

async function deleteCredential(credentialId: number) {
  return prisma.credential.delete({ where: { id: credentialId } });
}

const credentialRepository = {
  insertCredential,
  getCredentialByTitle,
  getCredential,
  getAllCredential,
  deleteCredential
};

export default credentialRepository;
