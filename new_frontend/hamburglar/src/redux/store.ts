import { createStore } from 'redux'
import redemptionKeyReducer from "./redemptionKeyReducer"

export interface StoreState {
    key: RedemptionKeyState
}

export interface RedemptionKeyState {
    token: string,
    key: string,
    expires: Date,
    expired: boolean
}

export interface Action {
    object: string,
    type: string,
    data?: any,
}

const store = createStore(redemptionKeyReducer)
export default store;