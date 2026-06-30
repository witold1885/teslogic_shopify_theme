import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/products'
import reviewsReducer from './slices/reviews'

const store = configureStore({
  reducer: {
    products: productsReducer,
    reviews: reviewsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
