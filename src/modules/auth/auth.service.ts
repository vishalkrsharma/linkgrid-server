import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SigninDto } from 'src/modules/auth/dto/signin-dto';
import bcrypt from 'bcryptjs';
import { SignupDto } from 'src/modules/auth/dto/signup-dto';
import { GridsService } from 'src/modules/grids/grids.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private gridService: GridsService,
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

    const token = this.jwtService.sign({ userId: createdUser._id });

    this.gridService.createDefaultGrid(createdUser._id, createdUser.username);

    return {
      user: createdUserWithoutPassword,
      token,
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

    const checkPassword = await bcrypt.compare(password, existingUser.password);

    if (!checkPassword) {
      throw new HttpException(
        {
          message: 'Invalid password',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const token = this.jwtService.sign({ _id: existingUser._id });

    const { password: existingUserPassword, ...existingUserWithoutPassword } =
      existingUser.toObject();

    return {
      user: existingUserWithoutPassword,
      token,
      message: 'Signin successful',
    };
  }
}
