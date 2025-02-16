import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from 'src/modules/auth/dto/signup-dto';
import { SigninDto } from 'src/modules/auth/dto/signin-dto';
import { AccessTokenGuard } from 'src/common/gaurds/access-token.guard';
import { RefreshTokenGuard } from 'src/common/gaurds/refresh-token.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('signout')
  signout(@Req() req: Request) {
    this.authService.signout(req.user['_id']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['_id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
