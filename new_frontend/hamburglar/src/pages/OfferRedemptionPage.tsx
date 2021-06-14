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
import useLocalStorageState from 'use-local-storage-state'
import { useSelector } from "react-redux";
import { StoreState } from "../redux/store";

type Params = {
    token: string,
}

const OfferRedemptionPage = (props: any) => { 
    const { token } = useParams<Params>();
    const history = useHistory()
    const redemptionKey = useSelector((state: StoreState) => state.key)
    
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
            </HStack>

            {redemptionKey && redemptionKey.token === token && !redemptionKey.expired &&
                <HStack bg="gray.900" p={3} m2={2} mb={2} borderRadius="lg" centerContent>
                    <IoAlertCircle color="white" size="40px"/>
                    <Heading as="h2" size="sm" color="white"> You recently redeemed this offer </Heading>
                </HStack>
            }
            
            <OfferRedemptionModule offerToken={token} />
          
            </Flex>
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