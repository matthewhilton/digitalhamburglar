import OfferImage from "./offerImage"
import { SimpleGrid, Box, Text } from "@chakra-ui/react"
import NextLink from "next/link"

interface Props {
    offerGroups: Array<OfferGroup>
}

interface OfferGroup {
    hash: string;
    image: string;
    title: string;
}

const OfferGrid = ({offerGroups, ...props}: Props) => { 
    if(offerGroups.length == 0){
        return(
            <Text fontWeight="bold" color="white"> No Offers Available Currently </Text> 
        )
    }

    return(
        <SimpleGrid minChildWidth="120px" spacing="10px">
            { offerGroups.map(offerGroup => <OfferGridCard offerGroup={offerGroup} key={offerGroup.hash} /> )}
        </SimpleGrid>
    )
}

const OfferGridCard = ({offerGroup}: { offerGroup: OfferGroup}) => (
    <NextLink href="/offer/[offerHash]" as={'/offer/' + encodeURIComponent(offerGroup.hash)}>
        <Box bg="gray.900" p={3} borderRadius="lg" maxWidth={250}>
            <OfferImage image={offerGroup.image} style={{width: "300px"}} />
            <Text color="gray.100" fontWeight="bold" noOfLines={4} p={1}>{offerGroup.title}</Text>
        </Box>
    </NextLink>
)

export default OfferGrid