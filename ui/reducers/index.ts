import { I_Game, I_Notification, I_Transaction } from "@/types";
import gamesReducer from "./games";
import notificationsReducer from "./notifications";
import transactionReducer from "./transaction";

export interface I_State {
  games: I_Game[];
  notifications: I_Notification[];
  transaction: I_Transaction | null;
}

const rootReducer: React.Reducer<I_State, any> = (
  { games, notifications, transaction },
  action
) => ({
  games: gamesReducer(games, action),
  notifications: notificationsReducer(notifications, action),
  transaction: transactionReducer(transaction, action),
});

export default rootReducer;
