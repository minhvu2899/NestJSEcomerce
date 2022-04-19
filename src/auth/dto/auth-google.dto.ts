import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthGoogleDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsString()
  email: string;
  avatar?: string;
}
