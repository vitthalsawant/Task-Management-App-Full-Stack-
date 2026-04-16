import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const SALT_ROUNDS = 12;

function sanitizeUser(user: any) {
  if (!user) return user;
  const obj = typeof user.toObject === 'function' ? user.toObject() : user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = obj;
  return rest;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(params: { email: string; password: string; name: string }) {
    const existing = await this.usersService.findByEmail(params.email);
    if (existing) throw new BadRequestException('Email already registered');

    const hashed = await bcrypt.hash(params.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      email: params.email,
      password: hashed,
      name: params.name,
    });

    const tokens = await this.issueTokens({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return { user: sanitizeUser(user), ...tokens };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    return sanitizeUser(user);
  }

  async login(user: { _id: any; email: string; name: string }) {
    const tokens = await this.issueTokens({
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    return { user, ...tokens };
  }

  private async issueTokens(payload: { sub: string; email: string; name: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.secret'),
      expiresIn: this.configService.getOrThrow<string>('jwt.expiresIn') as any,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: this.configService.getOrThrow<string>('jwt.refreshExpiresIn') as any,
    });

    return { accessToken, refreshToken };
  }
}

