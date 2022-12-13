import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { encrypt } from "@/utils/criptrUtils";
import { Credential, User } from "@prisma/client";

export async function createCredential(user: User ): Promise<Credential> {
  const newPassword = encrypt(user.password);
  return prisma.credential.create({
    data: {
      title: faker.lorem.sentence(),
      url: faker.internet.url(),
      username: faker.name.findName(),
      password: newPassword,
      userId: user.id
    },
  });
}
