import { Button } from "@chakra-ui/button";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "../redux/store";

const CancelRedemptionButton = () => {
    const key = useSelector((state: StoreState) => state.key);
    const [disabled, setDisabled] = useState<boolean>(false)
    const dispatch = useDispatch();

    

    const cancelRedemption = () => {
        setDisabled(true);
        (async () => {
            await fetch(process.env.REACT_APP_API_ENDPOINT + '/key/expire?redemptionKey=' + key.key)
            dispatch({
                object: 'key',
                type: 'expire'
            })
            setDisabled(false)
        })()
    }
    
    return <Button background="red" onClick={cancelRedemption} disabled={disabled}> Cancel Redemption </Button>
}

export default CancelRedemptionButton;