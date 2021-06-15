import { Action, RedemptionKeyState, StoreState } from "./store";

const defaultKey: RedemptionKeyState = {
    token: '',
    key: '',
    expires: new Date(),
    expired: true
}

const redemptionKeyReducer = (state: StoreState = { key: defaultKey }, action: any) => {
    if(action.object !== 'key') return state;

    if(action.type === 'new'){
        return {
            ...state,
            key: action.data
        }
    }

    if(action.type === 'expire'){
        return {
            ...state,
            key: {
                ...state.key,
                expired: true
            }
        }
    }

    return state;
}

export default redemptionKeyReducer;