import { I_Game } from "@/types";

export enum E_GameActionType {
  LoadGames = "LoadGames",
  AddGame = "AddGame",
  RemoveGame = "RemoveGame",
}

export interface I_AddGameAction {
  type: E_GameActionType.AddGame;
  payload: I_Game;
}

interface I_RemoveGamePayload {
  id: number;
}

export interface I_RemoveGameAction {
  type: E_GameActionType.RemoveGame;
  payload: I_RemoveGamePayload;
}

export interface I_LoadGamesAction {
  type: E_GameActionType.LoadGames;
  payload: I_Game[];
}

const gamesReducer: React.Reducer<
  I_Game[],
  I_AddGameAction | I_RemoveGameAction | I_LoadGamesAction
> = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case E_GameActionType.LoadGames:
      return payload;
    case E_GameActionType.AddGame:
      return [...state, payload];
    case E_GameActionType.RemoveGame:
      return state.filter((i) => i.id !== payload.id);
    default:
      return state;
  }
};

export default gamesReducer;
