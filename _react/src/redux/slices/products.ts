import { createSlice } from '@reduxjs/toolkit'
import { initialState } from '../states/products'

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {}
})

export default productsSlice.reducer
