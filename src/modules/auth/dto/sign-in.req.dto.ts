import { PickType } from '@nestjs/swagger';

import { ManagerReqDto } from 'src/modules/managers/dto/create-manager.dto';

export class SignInReqDto extends PickType(ManagerReqDto, [
  'email',
  'password',
]) {}
