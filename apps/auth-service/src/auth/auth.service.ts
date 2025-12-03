import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string, salt: string | number) {
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  // ✅ Make register return { user, token }
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already in use.');
    }

    const password_hash = await this.hashPassword(createUserDto.password, 10);

    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      password_hash,
    });

    const savedUser = await this.usersRepository.save(newUser);

    // 🔑 Create JWT token
    const token = this.jwtService.sign({
      id: savedUser.id,
      email: savedUser.email,
    });

    return { user: savedUser, token };
  }

  // ✅ Make login return { user, token }
  async login(
    email: string,
    pass: string,
  ): Promise<{ user: User; token: string } | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) return null;

    const isPasswordValid = await this.comparePasswords(pass, user.password_hash);

    if (!isPasswordValid) return null;

    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });

    return { user, token };
  }
}
