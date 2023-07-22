import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UtilsState {
  lockedForm: string;
  meterIsSaved: boolean;
  language: string;
}

const initialState: UtilsState = {
  lockedForm: "",
  meterIsSaved: false,
  language: "en"
}

export const companyAndYearSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    setGlobalLanguage: (state, action: PayloadAction<{ language: string }>) => {
      const lang = action.payload.language;

      if (lang) {
        state.language = lang;
      }
    },
    setLockedForm: (state, action: PayloadAction<{ formid: string }>) => {
      state.lockedForm = action.payload.formid
    },
    setMeterIsSaved: (state, action: PayloadAction<{ status: boolean }>) => {
      state.meterIsSaved = action.payload.status
    },
  },
})

// Action creators are generated for each case reducer function
export const { setLockedForm, setMeterIsSaved, setGlobalLanguage } = companyAndYearSlice.actions

export default companyAndYearSlice.reducer