import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from 'src/modules/auth/dto/signin-dto';
import bcrypt from 'bcryptjs';
import { SignupDto } from 'src/modules/auth/dto/signup-dto';
import { GridsService } from 'src/modules/grids/grids.service';
import { ConfigService } from '@nestjs/config';
import { hashData } from 'src/common/lib/utils';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private gridService: GridsService,
    private configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;

    const existingUser = await new Promise((resolve) => {
      let resolved = false;

      const usernamePromise = this.usersService.findOne(username);
      const emailPromise = this.usersService.findOne(email);

      usernamePromise.then((user) => {
        if (user && !resolved) {
          resolved = true;
          resolve(user);
        }
      });

      emailPromise.then((user) => {
        if (user && !resolved) {
          resolved = true;
          resolve(user);
        }
      });

      Promise.allSettled([usernamePromise, emailPromise]).then(() => {
        if (!resolved) resolve(null);
      });
    });

    if (existingUser) {
      throw new HttpException(
        { message: 'User already exists' },
        HttpStatus.CONFLICT,
      );
    }

    const createdUser = await this.usersService.create({
      username,
      email,
      password,
    });

    const { password: createdUserPassword, ...createdUserWithoutPassword } =
      createdUser.toObject();

    const tokens = await this.getTokens(
      createdUser._id.toString(),
      createdUser.username,
    );
    await this.updateRefreshToken(
      createdUser._id.toString(),
      tokens.refreshToken,
    );

    this.gridService.createDefaultGrid(createdUser._id, createdUser.username);

    return {
      user: createdUserWithoutPassword,
      tokens,
      message: 'Signup successful',
    };
  }

  async signin(signinDto: SigninDto) {
    const { identifier, password } = signinDto;

    const existingUser = await this.usersService.findOne(identifier);

    if (!existingUser) {
      throw new HttpException(
        { message: 'User not found' },
        HttpStatus.CONFLICT,
      );
    }

    const checkPassword = await argon2.verify(existingUser.password, password);

    if (!checkPassword) {
      throw new HttpException(
        {
          message: 'Invalid password',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const tokens = await this.getTokens(
      existingUser._id.toString(),
      existingUser.username,
    );
    await this.updateRefreshToken(
      existingUser._id.toString(),
      tokens.refreshToken,
    );

    const { password: existingUserPassword, ...existingUserWithoutPassword } =
      existingUser.toObject();

    return {
      user: existingUserWithoutPassword,
      tokens,
      message: 'Signin successful',
    };
  }

  async signout(userId: string) {
    console.log('aa');
    return this.usersService.update(userId, { refreshToken: null });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.update(userId, {
      refreshToken: await hashData(refreshToken),
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          _id: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1m',
        },
      ),
      this.jwtService.signAsync(
        {
          _id: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
