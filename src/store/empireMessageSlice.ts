import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { initialState } from "./DecryptedMessage";
import { IEmpireMessage, IEmpireTarget } from "../types/EmpireMessage";

const empireMessageSlice = createSlice({
    name: 'empireMessage',
    initialState: initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<IEmpireTarget>) => {
            if(!state.find((s) => s.id === action.payload.id)) {
                state.push(action.payload)
            }
        },
        updateMessage: (state, action: PayloadAction<IEmpireTarget>) => {
            const index = state.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state[index] = { ...action.payload };
            }
        },
    },
});

export const { addMessage, updateMessage } = empireMessageSlice.actions;
export default empireMessageSlice.reducer;