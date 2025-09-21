import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register-use-case";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(prismaUsersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "jhondoe@exemple.com",
      password: "123456",
    });
    console.log(user.password_hash);
  });
});

