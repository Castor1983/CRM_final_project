import {ApiProperty} from "@nestjs/swagger";

export class TokenPairResDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
