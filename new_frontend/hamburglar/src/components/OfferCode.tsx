import { Box, Center, Heading, Text, VStack } from "@chakra-ui/layout";
import { useEffect, useState } from "react";
import { CubeSpinner } from "react-spinners-kit";
import ErrorDisplay from "../ErrorDisplay";
import { OfferDetails } from "./OfferRedemptionModule";
import bwipjs from "bwip-js"
import Countdown from "./Countdown";

interface Props {
    loading: boolean,
    error: string | null,
    data: OfferDetails | null,
}

const OfferCode = ({loading, error, data}: Props) => {
    const [expired, setExpired] = useState(false)

    useEffect(() => {
        if(data !== null){
            const options : bwipjs.ToBufferOptions = {
                bcid: "azteccode",
                text: data.barcodeData
            } 
            bwipjs.toCanvas("codeCanvas", options)
        }
    }, [data])

    if(loading) return(
        <Center height="270px">
            <CubeSpinner backColor="#00ff00" frontColor="green"/>
        </Center>
    )

    if(error) return (
        <ErrorDisplay error={error} />
    )

    if(data) return (
        <VStack> 
            <Heading color="white"> {data.code} </Heading>
            <Box p={2} borderRadius="lg" background="white">
                <canvas id="codeCanvas" style={{width: '100%', height: '100%', maxWidth: 250, maxHeight: 250, minWidth: 150, minHeight: 150, backgroundColor: "white"}} />
            </Box>
        </VStack>
    )

    return null;
}

export default OfferCode;