import { I_Game, I_Notification } from "@/types";
import gamesReducer from "./games";
import notificationsReducer from "./notifications";

export interface I_State {
  games: I_Game[];
  notifications: I_Notification[];
}

const rootReducer: React.Reducer<I_State, any> = (
  { games, notifications },
  action
) => ({
  games: gamesReducer(games, action),
  notifications: notificationsReducer(notifications, action),
});

export default rootReducer;
