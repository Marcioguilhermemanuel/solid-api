import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { RegisterUseCase } from "../../use-cases/register-use-case";
import { PrismaUsersRepository } from "../../repositories/prisma-users-repository";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const { name, email, password } = createUserSchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({
      name,
      email,
      password,
    });
   
  } catch (err) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
