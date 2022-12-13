import app, { init } from "@/app";
import { decrypt } from "@/utils/criptrUtils";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createCredential, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /credentials", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/credentials");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 201", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = {
        userId: user.id,
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
        username: faker.name.findName(),
        password: user.password
      };

      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.CREATED);
    });

    it("should respond with status 404 when the title is already in use. ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const credential = await createCredential(user);

      const body = {
        userId: user.id,
        title: credential.title,
        url: faker.internet.url(),
        username: faker.name.findName(),
        password: user.password
      };

      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when when information for the body is incorrect or incomplete", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = {
        userId: user.id,
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
        password: user.password
      };

      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe("GET /credentials/:credentialId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/credentials/2");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/credentials/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/credentials/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 when the search for a user occurs. ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const credential = await createCredential(user);

      const response = await server.get(`/credentials/${credential.id}`).set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        ...credential,
        password: decrypt(credential.password)
      });
    });

    it("should respond with status 404 when the credential id not found.", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get(`/credentials/${user.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe("GET /credentials", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/credentials");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/credentials").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/credentials").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 when the search for a user occurs. ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const credential = await createCredential(user);

      const response = await server.get("/credentials").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...credential,
            password: decrypt(credential.password)
          }),
        ]),
      );
    });
  });
});

describe("DELETE /credentials/:credentialId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.delete("/credentials/2");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.delete("/credentials/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete("/credentials/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200 when delete credential. ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const credential = await createCredential(user);

      const response = await server.delete(`/credentials/${credential.id}`).set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.OK);
    });

    it("should respond with status 404 when credential not exist in database. ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete("/credentials/1").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});
