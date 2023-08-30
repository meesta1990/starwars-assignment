import { configureStore } from '@reduxjs/toolkit';
import empireMessageSlice from './empireMessageSlice';

const store = configureStore({
    reducer: {
        empireMessageSlice,
    },
});

export default store;