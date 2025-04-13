import { IParkingArea } from "@/interfaces/Generic/IParkingArea";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface ParkingAreaSliceType{
    selectedParkingArea: IParkingArea | null;
}
const initialState:ParkingAreaSliceType = {
    selectedParkingArea: null
};

export const ParkingAreaSlice = createSlice({
    name: 'patkingArea',
    initialState: initialState,
    reducers: {
        selectParkingArea: (state, action: PayloadAction<IParkingArea>) => {
            state.selectedParkingArea = action.payload;
        },
        resetParkingArea: (state) => {
            state.selectedParkingArea = null;
        }
    }
})

export const { selectParkingArea, resetParkingArea } = ParkingAreaSlice.actions;
export default ParkingAreaSlice.reducer;