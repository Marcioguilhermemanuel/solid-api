import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import z from "zod";
import { prisma } from "../../lib/prisma";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const createUserSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  });

  const { name, email, password } = createUserSchema.parse(request.body);

  const userWithSamelEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSamelEmail){
    return reply.status(409).send()
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: await bcrypt.hash(password, 6),
    },
  });

  return reply.status(201).send();
}
