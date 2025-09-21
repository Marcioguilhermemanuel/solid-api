import { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { PrismaUsersRepository } from '../repositories/prisma-users-repository'
import { User } from "@prisma/client";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterUseCaseResponse {
  user: User
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

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: await bcrypt.hash(password, 6),
    });
    return {
      user
    }
  }
}

