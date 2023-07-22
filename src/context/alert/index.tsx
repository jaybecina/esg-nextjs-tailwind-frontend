import { createContext, FC, ReactNode, useReducer } from "react"
import { alertBoxInitialState, alertboxReducer, IAlertBoxState } from "./alertReducer";


const AlertBoxContext = createContext<any>(null);

const AlertBoxProvider: FC<{ children: ReactNode }> = (props) => {
  const [state, dispatch] = useReducer(alertboxReducer, alertBoxInitialState);

  const value = {
    state,
    show: (payload: IAlertBoxState) => {
      dispatch({ type: "show", payload })
    },
    hide: () => {
      dispatch({ type: "hide", payload: {} })
    }
  }

  return (
    <AlertBoxContext.Provider value={value}>
      {props.children}
    </AlertBoxContext.Provider>
  )
}

export {
  AlertBoxProvider,
  AlertBoxContext
}