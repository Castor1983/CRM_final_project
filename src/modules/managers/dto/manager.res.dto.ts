import { PickType } from '@nestjs/swagger';

import {ManagerReqDto} from "./create-manager.dto";

export class ManagerResDto extends PickType(ManagerReqDto, [
  'name',
  'email',
]) {}
