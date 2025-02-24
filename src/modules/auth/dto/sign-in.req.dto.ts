import { PickType } from "@nestjs/swagger";
import { BaseManagerDto } from "../../managers/dto/base-manager.dto";

export class SignInReqDto extends PickType(BaseManagerDto, [
  "email",
  "password",
]) {}
