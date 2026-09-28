import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already exists');
    
    return this.prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ 
      where: { email },
      include: { roles: true, subscription: true }
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: { roles: true, subscription: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(userId: string, data: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data
    });
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
    // Note: real implementation would check old pass, hash new pass.
    // We are simulating this.
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: 'hashed_new_password' }
    });
  }

  async deleteAccount(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId }
    });
  }
}
