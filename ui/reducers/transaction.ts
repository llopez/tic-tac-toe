import { I_Transaction } from "@/types";

export enum E_TransactionActionType {
  AddTransaction = "AddTransaction",
  RemoveTransaction = "RemoveTransaction",
}

export interface I_AddTransactionAction {
  type: E_TransactionActionType.AddTransaction;
  payload: I_Transaction;
}

export interface I_RemoveTransactionAction {
  type: E_TransactionActionType.RemoveTransaction;
  payload: null;
}

const transactionReducer: React.Reducer<
  I_Transaction | null,
  I_AddTransactionAction | I_RemoveTransactionAction
> = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case E_TransactionActionType.AddTransaction:
      return payload;
    case E_TransactionActionType.RemoveTransaction:
      return null;
    default:
      return state;
  }
};

export default transactionReducer;
