import { PartialType } from '@nestjs/mapped-types';

import { BaseManagerDto } from './base-manager.dto';

export class UpdateManagerDto extends PartialType(BaseManagerDto) {}
//TODO
