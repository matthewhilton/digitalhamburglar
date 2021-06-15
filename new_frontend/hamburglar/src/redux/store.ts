import { createStore } from 'redux'
import redemptionKeyReducer from "./redemptionKeyReducer"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'

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

const persistConfig = {
    key: 'root',
    storage,
    stateReconciler: hardSet
}

const persistedReducer = persistReducer(persistConfig, redemptionKeyReducer)


const store = createStore(persistedReducer)
let persistor = persistStore(store)

export default { store, persistor };