import { PropsWithChildren, createContext, useReducer } from "react";
import rootReducer, { I_State } from "@/reducers";
import { I_AddNotificationAction, I_RemoveNotificationAction } from "@/reducers/notifications";
import { I_AddGameAction, I_LoadGamesAction, I_RemoveGameAction } from "@/reducers/games";


const initialState: I_State = {
  games: [],
  notifications: []
}

export const Context = createContext<[I_State, React.Dispatch<I_AddGameAction | I_RemoveGameAction | I_LoadGamesAction | I_AddNotificationAction | I_RemoveNotificationAction>]>([
  initialState,
  () => { }
]);

export const StateProvider = (props: PropsWithChildren) => {
  const { children } = props

  const [state, dispatch] = useReducer(rootReducer, initialState)

  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
}