import React from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
        {children}
    </Provider>
)
