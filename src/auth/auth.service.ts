import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await argon2.hash(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      roles: {
        connectOrCreate: {
          where: { name: 'USER' },
          create: { name: 'USER' },
        },
      },
    });

    return this.generateTokens(user.id);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await argon2.verify(user.password, dto.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user.id);
  }

  async refreshToken(userId: string, refreshToken: string) {
    const session = await this.prisma.session.findFirst({
      where: { userId, expiresAt: { gt: new Date() } }
    });
    
    if (!session) throw new UnauthorizedException('Invalid or expired refresh token');
    
    const isValid = await argon2.verify(session.refreshTokenHash, refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    return this.generateTokens(userId);
  }

  private async generateTokens(userId: string) {
    const user = await this.usersService.findById(userId);
    const payload = { 
      sub: user.id, 
      email: user.email, 
      roles: user.roles.map(r => r.name) 
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });

    const refreshTokenString = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    const refreshTokenHash = await argon2.hash(refreshTokenString);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
    };
  }
}
