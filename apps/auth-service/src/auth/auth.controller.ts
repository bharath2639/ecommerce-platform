// apps/auth-service/src/auth/auth.controller.ts :

import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  ValidationPipe, 
  UnauthorizedException, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/create-user.dto';
import { LoginUserDto } from './login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 📝 REGISTRATION ENDPOINT
  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);

    return {
      id: result.user.id,
      email: result.user.email,
      token: result.token, // Returns the JWT immediately after signup
      message: 'Registration successful',
    };
  }

  // 🔑 LOGIN ENDPOINT
  @Post('login')
  async login(@Body(new ValidationPipe()) loginUserDto: LoginUserDto) {
    const result = await this.authService.login(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: result.user.id,
      email: result.user.email,
      token: result.token, // Returns the JWT for future requests
      message: 'Login successful',
    };
  }

  // 🛡️ PROTECTED PROFILE ROUTE
  // This route is guarded. You must send "Authorization: Bearer <TOKEN>" header.
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    // req.user is populated by the JwtStrategy.validate() method
    return req.user;
  }
}