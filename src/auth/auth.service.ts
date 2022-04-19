import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { UsersService } from './../users/users.service';
import { RolesService } from './../roles/roles.service';
import { MailService } from './../mail/mail.service';
import { User } from 'src/users/user.entity';
import { AuthSignupDto } from './dto/auth-signup.dto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
    private mailService: MailService,
  ) {}

  async signUp(authCredentialsDto: AuthSignupDto): Promise<void> {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    // ...
    // send confirmation mail
    await this.usersService.createUser(authCredentialsDto);
    const user = await this.usersService.findUserByUsername(
      authCredentialsDto.username,
    );
    console.log(user);
    await this.mailService.sendUserConfirmation(user, token);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; user: any }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersService.findOne({ username }, ['role']);

    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản bị khóa');
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);
      const data = {
        id: user.id,
        role: user.role,
        avatar: user.avatar,
        name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      };
      return { accessToken, user: data };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
  async forgotPassword(email: string) {
    const token = await this.usersService.updateResetPassWordToken(email);
    await this.mailService.sendResetPassWord(email, token);
  }
  async googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }
    return req.user;
  }
}
