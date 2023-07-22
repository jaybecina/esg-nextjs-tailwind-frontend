import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CompanyAndYearState {
  year: string;
  companyId: string;
  company: { [key: string]: any }
}

const initialState: CompanyAndYearState = {
  companyId: "",
  year: new Date().getFullYear().toString(),
  company: {}
}

export const companyAndYearSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setGlobalCompanyId: (state, action: PayloadAction<{ id: string }>) => {
      localStorage.setItem("company-selected", action.payload.id)
      state.companyId = action.payload.id;
    },
    setGlobalYear: (state, action: PayloadAction<{ year: string }>) => {
      state.year = action.payload.year
    },
    setGlobalCompany: (state, action: PayloadAction<{ company: any }>) => {
      state.company = action.payload.company
    }
  },
})

// Action creators are generated for each case reducer function
export const { setGlobalCompany, setGlobalYear, setGlobalCompanyId } = companyAndYearSlice.actions

export default companyAndYearSlice.reducer