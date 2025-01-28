import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreatePasswordDto {
   @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  //@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  password: string;

   @ApiProperty({ example: '123qwe!@#QWE' })
  @IsString()
  @Length(0, 300)
  //@Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{8,}$/)
  confirmPassword: string;
}
