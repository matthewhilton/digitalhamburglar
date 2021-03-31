import { useEffect, useState } from "react";
import bwipjs from "bwip-js"
import { Center, VStack, Heading, Box } from "@chakra-ui/react"
import ErrorDisplay from "./errorDisplay";
import { CubeSpinner } from "react-spinners-kit";

interface OfferResponse {
    error: string | null
    data: null | {
        code: string,
        barcodeData: string,
        expirationTime: string,
    }
    loading: boolean
}

const OfferRedemption = ({externalId}: {externalId: string}) => {
    const [offer, setOffer] = useState<OfferResponse | null>({ error: null, data: null, loading: false})

    useEffect(() => {

        setOffer({
            error: null,
            data: null,
            loading: true
        })

        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/offers/redeem?externalId=${externalId}`)
        .then(res => res.json())
        .then(data => setOffer({
            error: null,
            data: data,
            loading: false
        }))
        .catch(() => setOffer({
            error: "Error getting redemption code",
            data: null,
            loading: false,
        }))
    }, [externalId, setOffer])

    useEffect(() => {
        if(offer.data){
            const options : bwipjs.ToBufferOptions = {
                bcid: "azteccode",
                text: offer.data.barcodeData
            } 
            bwipjs.toCanvas("codeCanvas", options)
        }
    }, [offer.data])

    return(
        <Center>
            {!offer.loading && !offer.error && offer.data &&
                <VStack> 
                    <Heading color="white"> {offer.data.code} </Heading>
                    <Box p={2} borderRadius="lg" background="white">
                        <canvas id="codeCanvas" style={{width: '100%', height: '100%', maxWidth: 250, maxHeight: 250, minWidth: 150, minHeight: 150, backgroundColor: "white"}} />
                    </Box>
                </VStack>}
            {offer.loading &&
                <Center height="270px">
                    <CubeSpinner backColor="#00ff00" frontColor="green"/>
                </Center>
            }
            {offer.error &&
                <ErrorDisplay showButton={false} error={offer.error} />
            }
        </Center>
    )
}

export default OfferRedemption