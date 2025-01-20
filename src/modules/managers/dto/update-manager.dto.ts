import { PartialType } from '@nestjs/mapped-types';
import { ManagerReqDto } from './create-manager.dto';

export class UpdateManagerDto extends PartialType(ManagerReqDto) {}
