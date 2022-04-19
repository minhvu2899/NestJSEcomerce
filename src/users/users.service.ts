import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { RolesService } from './../roles/roles.service';
import { AuthSignupDto } from 'src/auth/dto/auth-signup.dto';
import { AuthGoogleDto } from './../auth/dto/auth-google.dto';
@Injectable()
export class UsersService extends AbstractService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private rolesService: RolesService,
  ) {
    super(usersRepository);
  }
  async updateResetPassWordToken(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('Email không hợp lệ');
    }
    const token = await bcrypt.genSalt(64);
    user.resetPassWordToken = token;
    await this.usersRepository.save(user);
    return token;
  }
  async resetPassword(password: string, email: string): Promise<void> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('Email không hợp lệ');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
  }
  async getResetPassWordToken(email: string): Promise<string> {
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new BadRequestException('Email không hợp lệ');
    }

    return user.resetPassWordToken;
  }
  async createUser(authCredentialsDto: AuthSignupDto): Promise<void> {
    const { password } = authCredentialsDto;
    console.log(authCredentialsDto);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const roleUser = await this.rolesService.findOne({ name: 'User' });
    const user = this.usersRepository.create({
      ...authCredentialsDto,
      password: hashedPassword,
      role: roleUser,
    });

    try {
      await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async createUserGoogle(authCredentialsDto: AuthGoogleDto): Promise<User> {
    console.log(authCredentialsDto);
    const roleUser = await this.rolesService.findOne({ name: 'User' });
    console.log(roleUser);
    const user = this.usersRepository.create({
      ...authCredentialsDto,
      role: roleUser,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async findUserByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOne({ username });
  }
  async getAllUser(): Promise<User[]> {
    return await this.usersRepository.find({ relations: ['role'] });
  }
  async getUserById(id: string, relation) {
    const user = await this.findOne(id, relation);
    const roleId = user.role.id;
    const permission = await this.rolesService.findOne({ id: roleId }, [
      'permissions',
    ]);
    if (!user) {
      throw new Error('User not found');
    }
    user.role = permission;
    return user;
  }
}
