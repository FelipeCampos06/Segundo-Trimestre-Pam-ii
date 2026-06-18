import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUsuarioDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsString()
  @IsNotEmpty()
  senha: string;
}
