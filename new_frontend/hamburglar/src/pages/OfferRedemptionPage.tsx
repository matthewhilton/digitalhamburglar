import { Box, Center, Container, Flex, Heading, HStack, Spacer, Text } from "@chakra-ui/layout";
import { CubeSpinner, SpiralSpinner } from "react-spinners-kit";
import OfferDisplay from "../components/OfferDisplay";
import useSWR from "swr"
import ErrorDisplay from "../ErrorDisplay";
import { useParams, useHistory } from 'react-router-dom'
import { useState } from "react";
import OfferImage from "../components/OfferImage";
import { Button } from "@chakra-ui/button";
import { IoAlertCircle, IoChevronBackCircleSharp } from "react-icons/io5";
import OfferRedemptionModule from "../components/OfferRedemptionModule";

type Params = {
    token: string,
}

const OfferRedemptionPage = (props: any) => { 
    const [offerRedeemOpen, setOfferRedeemOpen] = useState(false)
    const { token } = useParams<Params>();
    const history = useHistory()
    if(token === undefined) throw new Error("No token given.") // TODO maybe redirect

    const { data, error } = useSWR(process.env.REACT_APP_API_ENDPOINT + '/details?offerToken=' + token)
    
    if (error) return <ErrorDisplay error={"Could not get offer"} />
    if (!data) return <SpiralSpinner backColor="#00ff00" frontColor="green" />

    return(
    <Container maxW="container.md" centerContent={true} height="90vh">
        <Flex direction="column" justify="start" alignItems="stretch" flexGrow={1}>
            <HStack>
                <Text fontWeight="bold" color="white" noOfLines={5}>{data.title}</Text>
                <Box maxWidth="250px" minWidth="150px">
                    <OfferImage image={data.image} />
                </Box>
            </HStack>

            <Flex marginTop="20px" marginBottom="10px" direction="column">
            <HStack align="center" marginBottom="10px">
                <Button colorScheme="whiteAlpha" leftIcon={<IoChevronBackCircleSharp />} onClick={() => history.push("/")}> Back </Button>
                {!offerRedeemOpen && <Button isFullWidth={true} onClick={() => setOfferRedeemOpen(true)} colorScheme="brand"> Get Offer Code </Button>}
            </HStack>

            {offerRedeemOpen && <OfferRedemptionModule offerToken={token} /> }
          
            </Flex>

            { !offerRedeemOpen && 
            <HStack justify="center">
                <IoAlertCircle color="orange" size="20px"/>
                <Text color="orange" textAlign="justify" fontSize="small" as="em"> All codes are shared - when redeemed, you have 2 minutes to use the code before it becomes available again.</Text>
            </HStack>
            }
            <Spacer />
            <Box marginTop="50px">
                <Text textAlign="center" color="white" fontWeight="bold"> Offer Expires {new Date(data.validto).toDateString()} </Text>
                <Text textAlign="center" color="white" fontSize='9px' isTruncated={true} > {data.offertoken} </Text> 
            </Box>
        </Flex>
    </Container>
    )
    
}

export default OfferRedemptionPage;