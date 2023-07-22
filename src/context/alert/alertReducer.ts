export interface IAlertBoxState {
  type?: "success" | "warning" | "error" | "";
  title?: string;
  description?: string;
  isVisible?: boolean;
  duration?: number;
}

export const alertBoxInitialState: IAlertBoxState = {
  type: "",
  title: "",
  description: "",
  isVisible: false,
  duration: 3000
}

export interface ActionType {
  type: string;
  payload: IAlertBoxState;
}

export const alertboxReducer = (
  state: IAlertBoxState = alertBoxInitialState,
  action: ActionType) => {

  switch (action.type) {
    case "show": {
      return {
        ...state,
        isVisible: true,
        title: action.payload.title,
        type: action.payload.type,
        description: action.payload.description,
        duration: action.payload.duration || 5000,
      }
    }
    case "hide": {
      return {
        ...state,
        isVisible: false,
      }
    }
    default: return state;
  }
}