import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
}

export const roomsIdsSlice =  createSlice({
    name: 'roomsIds',
    initialState,
    reducers: {
        setRoomsIds: (state, action) => {
            state.value = action.payload
        }
    }
})

export const {setRoomsIds} = roomsIdsSlice.actions
export default roomsIdsSlice.reducer