import { useCallback, useEffect, useState } from "react";
import { RedemptionKeyState } from "../redux/store";
import ErrorDisplay from "./ErrorDisplay";
import OfferCode from "./OfferCode";
import { Center, HStack, VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { CubeSpinner } from "react-spinners-kit";
import Countdown from "./Countdown";
import CancelRedemptionButton from "./CancelRedemptionButton";

interface Props {
    redemptionKey: RedemptionKeyState,
    onGetNewKey: () => void
}

export interface OfferDetails {
    code: string,
    barcodeData: string,
    expirationTime: string
}

interface QueryState {
    data: undefined | OfferDetails
    error: undefined | string
}

const OfferCodeModule = ({ redemptionKey, onGetNewKey }: Props) => {
    const [query, setQuery] = useState<QueryState>({data: undefined, error: undefined})

    const getCode = useCallback(
        () => {
            (async () => {
                setQuery({data: undefined, error: undefined})
                console.log(redemptionKey)
                const res = await fetch(process.env.REACT_APP_API_ENDPOINT + '/offers/code?redemptionKey=' + redemptionKey.key)
                if(!res.ok) {
                    const errorText = await res.text()
                    setQuery({data: undefined, error: errorText})
                    console.error(errorText)
                    return;
                } 
                const json = await res.json();
                setQuery({data: json, error: undefined})
            })()
        },
        [redemptionKey],
      );

    useEffect(() => {
        if(redemptionKey && !redemptionKey.expired){
            getCode();
        }
    }, [redemptionKey, getCode])

    const { data, error } = query;

    if(!redemptionKey || redemptionKey.expired) return(
        <Button isFullWidth={true} onClick={onGetNewKey} colorScheme="brand"> Get Offer Code </Button>
    )

    if(error) return (
        <VStack>
            <Button isFullWidth={true} onClick={onGetNewKey} colorScheme="brand"> Get Offer Code </Button>
            <ErrorDisplay error={error} />
        </VStack>
    )

    if(!data) return (
        <Center height="270px">
            <CubeSpinner backColor="#00ff00" frontColor="green"/>
        </Center>
    )

    if(data) return (
        <VStack>
          <OfferCode code={data}/>
          <Countdown to={redemptionKey.expires} />

          <HStack>
            <CancelRedemptionButton />
            <Button onClick={getCode}> New Code </Button>
          </HStack>
        </VStack>
    )

    return null;
}

export default OfferCodeModule;