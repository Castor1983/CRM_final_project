import { PickType } from '@nestjs/swagger';

import { ManagerReqDto } from 'src/modules/managers/dto/create-manager.dto';
import {IsNotEmpty, IsString} from "class-validator";

export class SignInReqDto extends PickType(ManagerReqDto, [
  'email',
  'password',
]) { @IsNotEmpty()
@IsString()
readonly deviceId: string;}
