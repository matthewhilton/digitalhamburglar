import useLocalStorageState from 'use-local-storage-state'
import useSWR from "swr"
import { Container, Heading, HStack, Text } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import jwt_decode from "jwt-decode";
import OfferImage from './OfferImage';
import { IoAlertCircle } from 'react-icons/io5';
import React, { useState } from 'react';
import Countdown from './Countdown';
import useInterval from '../functions/useInterval';
import { useSelector } from 'react-redux';
import { StoreState } from '../redux/store';
import { useHistory } from 'react-router-dom';
import CancelRedemptionButton from './CancelRedemptionButton';

const OfferRedemptionStatus = () => {
    const key = useSelector((state: StoreState) => state.key);
    const history = useHistory();

    if(key !== null && !key.expired) {
        return(
            <Container bg="gray.900" p={3} borderRadius="lg" centerContent>
                <Heading as="h2" size="l" color="white" mb={2}> You recently redeemed an offer </Heading>
                {key.token ? <OfferDetails offerToken={key.token} /> : null}

                <Countdown to={key.expires} />

                <HStack justify="center" mt={3}>
                    <IoAlertCircle color="red" size="5vh"/>
                    <Text color="red" textAlign="justify" fontSize="small" as="em"> You can't redeem any more offers until the offer is used, it expires or is cancelled using the button below.</Text>
                </HStack>

                <HStack align={'stretch'} mt={2} mb={2}>
                    <CancelRedemptionButton />
                    <Button onClick={() => history.push('/redeem/' + key.token)}> View Offer </Button>
                </HStack>
            </Container>
        )
    } 

    return null;    
}

const OfferDetails = ({offerToken}: {offerToken: string}) => {
    const {data, error} = useSWR(process.env.REACT_APP_API_ENDPOINT + '/details?offerToken=' + offerToken)
    if(error) return null;
    if(data) return(
        <HStack color="white">
            <Text> {data.title} </Text>
            <OfferImage image={data.image} style={{width: "100px"}}/>
        </HStack>
    )

    return null;
}

export default OfferRedemptionStatus