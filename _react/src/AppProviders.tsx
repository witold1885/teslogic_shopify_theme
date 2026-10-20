import type { FC, ReactNode } from 'react'
import { Provider } from 'react-redux'
import store from './redux/store'

export const AppProviders: FC<{ children: ReactNode }> = ({ children }) => (
    <Provider store={store}>
        {children}
    </Provider>
)
