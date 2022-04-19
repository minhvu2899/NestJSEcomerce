import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
// import { AuthGoogleDto } from './dto/auth-google.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { AuthSignupDto } from 'src/auth/dto/auth-signup.dto';
import { GetUser } from './get-user.decorator';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthSignupDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }
  @Post('/resetPassword')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }
  @Get('/google/success')
  async googleAuthSuccess(@Req() res) {
    console.log('res', res.cookies);
    return res.cookies;
  }
  // @Get('/google/failure')
  // async googleAuthfailure(@Query('data') data, @Req() req) {
  //   console.log('res', res.data);
  //   // return data;
  // }
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    req.logout();
  }

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const data = await this.authService.googleLogin(req);
    console.log('data', data);
    if (data === 'No user from google') {
      res.redirect(`/auth/google/failure`);
    } else {
      // res.user = JSON.stringify(data);
      // res.sendata('Hello').redirect(`/auth/google/success`);
      return (
        res
          .status(HttpStatus.OK)
          .cookie('data', JSON.stringify(data), {
            httpOnly: false,
          })
          // .redirect('/auth/google/success');
          .redirect(`http://localhost:3000`)
      );
    }
  }
}
