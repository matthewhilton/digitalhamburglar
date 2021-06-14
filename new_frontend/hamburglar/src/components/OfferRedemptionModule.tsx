import { Center, Container, Heading, HStack, Text, VStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorDisplay from "../ErrorDisplay";
import OfferCode from "./OfferCode";
import useLocalStorageState from 'use-local-storage-state'
import { jwtDate, jwtExpired } from "../functions/jwtExpired";
import Countdown from "./Countdown";
import { useDispatch, useSelector } from 'react-redux'
import { StoreState } from "../redux/store";
import OfferCodeModule from "./OfferCodeModule";
import { Button } from "@chakra-ui/button";
import { IoAlertCircle } from "react-icons/io5";

interface Props {
    offerToken: string,
}

const OfferRedemptionModule = ({offerToken}: Props) => {
    const dispatch = useDispatch();
    const redemptionKey = useSelector((state: StoreState) => state.key)
    const [error, setError] = useState<null | string>(null)

    const getNewKey = () => {
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
    }
    
    useEffect(() => {
        if(redemptionKey === null){
            // Get a key
            getNewKey();
        }
    }, [redemptionKey]);

    if(error) return (
        <ErrorDisplay error={error} />
    ) 

    if(redemptionKey) return (
        <VStack>
            <OfferCodeModule redemptionKey={redemptionKey} onGetNewKey={getNewKey} />
            <HStack justify="center">
                <IoAlertCircle color="orange" size="20px"/>
                <Text color="orange" textAlign="justify" fontSize="small" as="em"> All codes are shared - when redeemed, you have 2 minutes to use the code before it becomes available to others.</Text>
            </HStack>
        </VStack>
    ) 
    // Else redemption key is loading...
    return null;
}

export default OfferRedemptionModule;