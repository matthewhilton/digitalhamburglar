import { Center, Container, Heading, Text, VStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorDisplay from "../ErrorDisplay";
import OfferCode from "./OfferCode";
import useLocalStorageState from 'use-local-storage-state'
import { jwtDate, jwtExpired } from "../functions/jwtExpired";
import Countdown from "./Countdown";

interface Props {
    offerToken: string,
}

export interface OfferDetails {
    code: string,
    barcodeData: string,
    expirationTime: string
}

const OfferRedemptionModule = ({offerToken}: Props) => {
    const [redemptionKey, setRedemptionKey] = useLocalStorageState<null | string>('redemptionKey', null)
    const [error, setError] = useState<null | string>(null)
    const [code, setCode] = useState<null | OfferDetails>(null)
    const redeemOfferBy = redemptionKey !== null ? jwtDate(redemptionKey) : null;
    const [expired, setExpired] = useState(false)
    
    const getRedemptionKey = () => {
        (async() => {
            const res = await fetch(process.env.REACT_APP_API_ENDPOINT + '/offers/redeem?offerToken=' + offerToken)
            if(!res.ok) {
                if(res.status === 400) return setError(await res.text())
                setError("Error getting offer")
            }

            const json = await res.json();
            
            // Save to state (and persist to localStorage)
            setRedemptionKey(json.key)
        })()
    }
    
    useEffect(() => {
        // If user does not have a redemption key, try and get one
        if(redemptionKey === null) {
            getRedemptionKey()
        }
    }, [offerToken])

    useEffect(() => {
        // Whenever redemption key changes, try and get a code for the offer
        if(redemptionKey !== null) {
            // Check key expiriation
            const keyExpired = jwtExpired(redemptionKey);

            // Reset key and try to get another one
            if(keyExpired) {
                setRedemptionKey(null)
                console.log("Saved redemption key was expired, trying to get a new one")
                getRedemptionKey();
                return;
            }

            // Else key *shouldnt* be expired and *should* work
            (async() => {
                const res = await fetch(process.env.REACT_APP_API_ENDPOINT + '/offers/code?redemptionKey=' + redemptionKey)
                if(!res.ok) {
                    if(res.status === 403) setRedemptionKey(null) // 403 means invalid token, so delete it 
                    return setError('Error getting offer code')
                }

                // Else got valid data
                const json = await res.json();
                setCode(json)
            })()
        }
    }, [redemptionKey])

    if(expired) return (
        <VStack>
            <Heading color="white"> Sorry! </Heading> 
            <Text color="white"> You took too long to redeem your offer. </Text>
        </VStack>
    )

    return (
        <VStack>
            <OfferCode loading={redemptionKey === null && !error} error={error} data={code}/>
            {redeemOfferBy !== null && <Countdown to={redeemOfferBy} onFinish={() => setExpired(true)} />}
        </VStack>
    )
}

export default OfferRedemptionModule;