// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import ParkingAreaReducer from './slices/ParkingAreaSlice';
import ReservationReducer from './slices/ReservationSlice';

export const store = configureStore({
  reducer: {
    parkingArea: ParkingAreaReducer, 
    reservation: ReservationReducer
  }
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
