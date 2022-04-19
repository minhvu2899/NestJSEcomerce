import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const exitsUser = await this.usersService.findOne({
      email: emails[0].value,
    });
    if (exitsUser) {
      const { id, username, email, firstName, lastName, avatar } = exitsUser;
      const accessToken: string = await this.jwtService.sign({
        username,
      });
      const data = {
        user: { id, email, firstName, lastName, avatar },
        accessToken,
      };
      done(null, data);
    } else {
      const payload = emails[0].value;

      const accessToken: string = await this.jwtService.sign({
        username: payload,
      });
      const user = {
        username: emails[0].value,
        email: emails[0].value,
        first_name: name.givenName,
        last_name: name.familyName,
        avatar: photos[0].value,
      };
      const newUser = await this.usersService.createUserGoogle(user);
      // const { id, email, first_name, last_name, avatar } = newUser;
      const data = {
        // user: { id, email, first_name, last_name, avatar },
        user: newUser,
        accessToken,
      };

      done(null, data);
    }
  }
}
