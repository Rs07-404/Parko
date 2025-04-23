import { IReservation, IReservationData } from "@/interfaces/Generic/IReservation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ReservationSliceType{
    reservation: IReservationData | IReservation | null;
}
const initialState:ReservationSliceType = {
    reservation: null
};

export const ReservationSlice = createSlice({
    name: 'Reservation',
    initialState: initialState,
    reducers: {
        setReservation: (state, action: PayloadAction<IReservationData>) => {
            state.reservation = action.payload;
        },
        resetReservation: (state) => {
            state.reservation = null;
        }
    }
})

export const { setReservation, resetReservation } = ReservationSlice.actions;
export default ReservationSlice.reducer;