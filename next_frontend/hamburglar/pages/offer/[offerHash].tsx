import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import OfferImage from '../../components/offerImage'
import OfferRedemption from '../../components/offerRedemption'
import { ApiResponse, OfferDetails } from '../../interfaces/apiInterfaces'
import { Container, Heading, HStack, Text } from '@chakra-ui/layout'
import { Button, Divider, Flex, Box, Spacer, CloseButton } from "@chakra-ui/react"
import { IoChevronBackCircleSharp, IoAlertCircle } from "react-icons/io5";
import ErrorDisplay from '../../components/errorDisplay'

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
                <Container maxW="container.md" centerContent={true} height="90vh">
                    <Flex direction="column" justify="start" alignItems="stretch" flexGrow={1}>
                        <HStack>
                            <Text fontWeight="bold" color="white" noOfLines={5}>{offer.title}</Text>
                            <OfferImage image={offer.image} style={{width: "150px"}}/>
                        </HStack>

                        <Flex marginTop="20px" marginBottom="10px" direction="column">
                        <HStack align="center" marginBottom="10px">
                            <Button colorScheme="whiteAlpha" leftIcon={<IoChevronBackCircleSharp />} onClick={() => router.push("/")}> Back </Button>
                            {!offerRedeemOpen && <Button isFullWidth={true} onClick={() => setOfferRedeemOpen(true)}> Get Offer Code </Button>}
                        </HStack>

                        { offerRedeemOpen && <OfferRedemption externalId={offer.externalId as string} /> }
                        </Flex>

                        { !offerRedeemOpen && 
                        <HStack justify="center">
                            <IoAlertCircle color="orange" size="20px"/>
                            <Text color="orange" textAlign="justify" fontSize="small" as="em">  Codes are shared between all website users, so only press redeem once you are ready to order. </Text>
                        </HStack>
                        }
                        <Spacer />
                        <Box marginTop="50px">
                            <Text textAlign="center" color="white" fontWeight="bold"> Offer Expires {new Date(offer.expires).toDateString()} </Text>
                            <Text textAlign="center" color="white" fontSize='9px' isTruncated={true} > {offer.externalId} </Text> 
                        </Box>
                    </Flex>
                </Container>
           
        )
    } else {
        return(
            <ErrorDisplay error={JSON.stringify(error)} />
        )
    }
  }
  
  export default OfferInformationPage