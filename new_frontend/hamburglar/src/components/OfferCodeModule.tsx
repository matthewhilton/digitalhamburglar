import { useEffect, useState } from "react";
import useSWR from "swr";
import { RedemptionKeyState } from "../redux/store";
import ErrorDisplay from "../ErrorDisplay";
import OfferCode from "./OfferCode";
import { VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";

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

    const getCode = () => {
        (async () => {
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
    }

    useEffect(() => {
        if(redemptionKey && !redemptionKey.expired){
            getCode();
        }
    }, [redemptionKey])

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

    if(data) return (
        <VStack>
          <OfferCode code={data}/>
          <Button onClick={getCode}> Get New Code </Button>
        </VStack>
    )

    return null;
}

export default OfferCodeModule;