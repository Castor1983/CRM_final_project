import { TokenPairResDto } from "./token-pair.res.dto";
import { ManagerResDto } from "../../managers/dto/manager.res.dto";

export class AuthResDto {
  tokens: TokenPairResDto;
  manager: ManagerResDto;
}
