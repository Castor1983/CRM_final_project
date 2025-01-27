import {TokenType} from "../database/enums/token-type.enum";

export interface ITokenActivate {
  activateToken: string;
  type: TokenType
}
