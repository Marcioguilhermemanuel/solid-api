import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: PrismaUsersRepository) {}

  async execute({ 
    name, 
    email, 
    password 
  }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new Error('Email already exists')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: await bcrypt.hash(password, 6),
    });
  }
}
