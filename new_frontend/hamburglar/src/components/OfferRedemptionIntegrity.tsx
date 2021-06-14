import { useDispatch, useSelector } from "react-redux";
import useInterval from "../functions/useInterval";
import { StoreState } from "../redux/store";

const OfferRedemptionIntegrity = () => {
    const key = useSelector((state: StoreState) => state.key);
    const dispatch = useDispatch()
    
    useInterval(() => {
        if(key != null){
            if(new Date(key.expires) < new Date()){
                dispatch({
                    object: 'key',
                    type: 'expire',
                })
            }
        }
    }, 500)

    // Invisible component, only checks the key expiry
    return null;
}

export default OfferRedemptionIntegrity;