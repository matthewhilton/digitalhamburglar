import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import OfferImage from '../../components/offerImage'
import OfferRedemption from '../../components/offerRedemption'
import { ApiResponse, OfferDetails } from '../../interfaces/apiInterfaces'
import { Container, Heading, HStack, Text } from '@chakra-ui/layout'
import { Button, Divider, Flex, Box, Spacer, CloseButton } from "@chakra-ui/react"
import { IoChevronBackCircleSharp } from "react-icons/io5";

export const getServerSideProps = async (context) => {
    if(!context.params.offerHash){
        // No externalID given, return error
        return { props: { error: "No offerHash given", data: null } as ApiResponse } 
    }

    const res = await fetch(`${process.env.API_ENDPOINT}/offers/details?offerHash=${context.params.offerHash}`)
    const errorCode = res.ok ? false : res.status
    const json = await res.json()
    
    return { props: { error: errorCode ? json : null, data: !errorCode ? json : null } as ApiResponse } 
  }

const OfferInformationPage = ({ data, error }: ApiResponse) => {
    const [offerRedeemOpen, setOfferRedeemOpen] = useState(false)
    const router = useRouter()

    if(data && !error){
        const offer = data as OfferDetails
        return(
                <Container maxW="container.md" centerContent={true} height="100%">
                    <Flex direction="column" justify="center" alignItems="stretch">
                        <HStack>
                            <Text fontWeight="bold" color="white" noOfLines={5}>{offer.title}</Text>
                            <OfferImage image={offer.image} style={{width: "150px"}}/>
                        </HStack>

                        <Flex marginTop="20px" marginBottom="20px" direction="column">
                        <HStack align="center" marginBottom="10px">
                            <Button colorScheme="whiteAlpha" leftIcon={<IoChevronBackCircleSharp />} onClick={() => router.push("/")}> Back </Button>
                            {!offerRedeemOpen && <Button isFullWidth={true} onClick={() => setOfferRedeemOpen(true)}> Get Offer Code </Button>}
                        </HStack>

                        { offerRedeemOpen && <OfferRedemption externalId={offer.externalId as string} /> }
                        </Flex>

                        <Text textAlign="center" color="green"> Expires {new Date(offer.expires).toDateString()} </Text>
                        <Text textAlign="center" color="green" fontSize='9px' isTruncated={true} > {offer.externalId} </Text> 
                    </Flex>
                </Container>
           
        )
    } else {
        return(
            <h1> {error} </h1> 
        )
    }
  }
  
  export default OfferInformationPage