import { PickType } from "@nestjs/swagger";

import { BaseManagerDto } from "./base-manager.dto";

export class ManagerResDto extends PickType(BaseManagerDto, [
  "name",
  "email",
]) {}
