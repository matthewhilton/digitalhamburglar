import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import OfferImage from '../../components/offerImage'
import OfferRedemption from '../../components/offerRedemption'
import { ApiResponse, OfferDetails } from '../../interfaces/apiInterfaces'
import { Container, Heading, HStack, Text, Center } from '@chakra-ui/layout'
import { Button, Divider, Flex, Box, Spacer, CloseButton } from "@chakra-ui/react"
import { IoChevronBackCircleSharp, IoAlertCircle, IoFastFood } from "react-icons/io5";
import ErrorDisplay from '../../components/errorDisplay'
import { GuardSpinner } from "react-spinners-kit";

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

const OfferInformationPage = ({ pageLoading, data, error}: { data: {} | null, error: {} | null, pageLoading: boolean}) => {
    const [offerRedeemOpen, setOfferRedeemOpen] = useState(false)
    const router = useRouter()

    if(pageLoading){
        return(
            <Center marginTop="20px">
                <GuardSpinner backColor="#00ff00" frontColor="green" />
            </Center> 
        )
    }

    if(data && !error){
        const offer = data as OfferDetails

        return(
                <Container maxW="container.md" centerContent={true} height="90vh">
                    <Flex direction="column" justify="start" alignItems="stretch" flexGrow={1}>
                        <HStack>
                            <Text fontWeight="bold" color="white" noOfLines={5}>{offer.title}</Text>
                            <Box maxWidth="250px" minWidth="150px">
                                <OfferImage image={offer.image} />
                            </Box>
                        </HStack>

                        <Flex marginTop="20px" marginBottom="10px" direction="column">
                        <HStack align="center" marginBottom="10px">
                            <Button colorScheme="whiteAlpha" leftIcon={<IoChevronBackCircleSharp />} onClick={() => router.push("/")}> Back </Button>
                            {!offerRedeemOpen && <Button isFullWidth={true} onClick={() => setOfferRedeemOpen(true)} colorScheme="brand"> Get Offer Code </Button>}
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