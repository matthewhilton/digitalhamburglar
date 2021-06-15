import { HStack, Text, VStack } from "@chakra-ui/layout";
import { useCallback, useEffect, useState } from "react";
import ErrorDisplay from "./ErrorDisplay";
import { jwtDate } from "../functions/jwtExpired";
import { useDispatch, useSelector } from 'react-redux'
import { StoreState } from "../redux/store";
import OfferCodeModule from "./OfferCodeModule";
import { IoAlertCircle } from "react-icons/io5";

interface Props {
    offerToken: string,
}

const OfferRedemptionModule = ({offerToken}: Props) => {
    const dispatch = useDispatch();
    const redemptionKey = useSelector((state: StoreState) => state.key)
    const [error, setError] = useState<null | string>(null)

    const getNewKey = useCallback(
        () => {
            (async() => {
                setError(null)
                const res = await fetch(process.env.REACT_APP_API_ENDPOINT + '/offers/redeem?offerToken=' + offerToken)
                if(!res.ok) {
                    if(res.status === 400) return setError(await res.text())
                    setError("Error getting offer")
                    console.error(res.text())
                    return;
                }
    
                const json = await res.json();
                const keyExpires = jwtDate(json.key)
                
                dispatch({ object: 'key', type: 'new', data: {
                    token: offerToken,
                    key: json.key,
                    expires: keyExpires,
                    expired: false
                }})
                // Dispatching the above will re-run this effect but will not do anything as the key is now not null
            })()
        },
        [offerToken, dispatch],
      );
    
    useEffect(() => {
        if(redemptionKey === null){
            // Get a key
            getNewKey();
        }
    }, [redemptionKey, getNewKey]);

    if(error) return (
        <ErrorDisplay error={error} />
    ) 

    if(redemptionKey) return (
        <VStack mt={3}>
            <OfferCodeModule redemptionKey={redemptionKey} onGetNewKey={getNewKey} />
            <HStack justify="center">
                <IoAlertCircle color="orange" size="40px"/>
                <Text color="orange" textAlign="justify" fontSize="small" as="em"> When redeemed, you have a limited time before the offer becomes available to others again.</Text>
            </HStack>
        </VStack>
    ) 
    // Else redemption key is loading...
    return null;
}

export default OfferRedemptionModule;