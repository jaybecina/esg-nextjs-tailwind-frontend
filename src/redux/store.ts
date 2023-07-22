import { configureStore } from '@reduxjs/toolkit'
import AuthReducer from "./slices/auth"
import CompanyAndYearReducer from "./slices/companyAndYear"
import UtilsReducer from "./slices/utils"

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    companyAndYear: CompanyAndYearReducer,
    utils: UtilsReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch