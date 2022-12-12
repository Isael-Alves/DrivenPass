import { prisma } from "@/config";
import { CreatCredentialType } from "@/protocols";
import faker from "@faker-js/faker";
import { encrypt } from "@/utils/criptrUtils";
import { User } from "@prisma/client";

export async function createCredential(user: User ): Promise<CreatCredentialType> {
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
