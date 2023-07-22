import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
export interface IUser {
  email: string;
  exp: number;
  iat: number;
  id: string;
  _id: string;
  role: "user" | "super-admin" | "client-admin";
  username: string;
  logo: any;
  company: any;
}

export interface AuthState {
  user: Partial<IUser>
  isAuthenticated: boolean;
  token?: string;
  lockedForm: {
    name: string;
    id: string;
  }
}

const initialState: AuthState = {
  user: {},
  isAuthenticated: false,
  token: "",
  // temporary. no need to add another slice
  lockedForm: {
    name: "",
    id: ""
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLockedForm: (state, action: PayloadAction<{ name: string, id: string }>) => {
      state.lockedForm = action.payload
    },
    setAuthenticatedUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    endSession(state) {
      localStorage.removeItem("jll-token")
      localStorage.removeItem("company-selected")
      localStorage.removeItem("year-selected")
      state.user = {};
      state.isAuthenticated = false;
      state.token = ""
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAuthenticatedUser, setAuthToken, endSession, setAuthLockedForm } = authSlice.actions

export default authSlice.reducer