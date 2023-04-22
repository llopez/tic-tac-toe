import { BigNumber } from "ethers";
import { Address } from "wagmi";

export enum E_Game_State {
  WaitingForPlayer = 0,
  Player1Turn = 1,
  Player2Turn = 2,
  Player1Won = 3,
  Player2Won = 4,
  Draw = 5,
}

export interface I_Game {
  id: number;
  player1: Address;
  player2: Address;
  state: E_Game_State;
  betAmount: number;
}

export interface I_Game_Response {
  id: BigNumber;
  player1: Address;
  player2: Address;
  state: number;
  betAmount: number;
}

export interface I_Notification {
  id: string;
  title: string;
  body: string;
}

export enum E_Transaction_Action {
  CreateGame = 0,
  JoinGame = 1,
  MakeMove = 2,
}

export interface I_Transaction {
  hash: Address;
  action: E_Transaction_Action;
}
