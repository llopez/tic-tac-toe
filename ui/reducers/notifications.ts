import { I_Notification } from "@/types";

export enum E_NotificationActionType {
  AddNotification = "AddNotification",
  RemoveNotification = "RemoveNotification",
}

export interface I_AddNotificationAction {
  type: E_NotificationActionType.AddNotification;
  payload: I_Notification;
}

interface I_RemoveNotificationPayload {
  id: number;
}

export interface I_RemoveNotificationAction {
  type: E_NotificationActionType.RemoveNotification;
  payload: I_RemoveNotificationPayload;
}

const notificationsReducer: React.Reducer<
  I_Notification[],
  I_AddNotificationAction | I_RemoveNotificationAction
> = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case E_NotificationActionType.AddNotification:
      return [...state, payload];
    case E_NotificationActionType.RemoveNotification:
      return state.filter((i) => i.id !== payload.id);
    default:
      return state;
  }
};

export default notificationsReducer;
