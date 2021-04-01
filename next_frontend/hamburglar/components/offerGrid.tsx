import OfferImage from "./offerImage"
import { SimpleGrid, Container, Text, HStack } from "@chakra-ui/react"
import NextLink from "next/link"
import { IoPricetag } from "react-icons/io5";

interface Props {
    offerGroups: Array<OfferGroup>
}

interface OfferGroup {
    hash: string;
    image: string;
    title: string;
    count: number;
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
        <Container bg="gray.900" p={3} borderRadius="lg" maxW="container.md" centerContent>
            <OfferImage image={offerGroup.image} style={{width: "300px"}} />
            <Text color="gray.100" fontWeight="bold" noOfLines={4} p={1}>{offerGroup.title}</Text>
            <HStack justify="start" direction="row" align="center" width="100%">
                <IoPricetag color="green" />
                <Text color="green" fontWeight="semibold">{offerGroup.count} code{offerGroup.count > 1 ? 's' : null}</Text>
            </HStack>
        </Container>
    </NextLink>
)

export default OfferGrid