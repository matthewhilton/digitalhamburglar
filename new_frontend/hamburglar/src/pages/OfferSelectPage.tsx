import { Container, Heading, Text, VStack } from "@chakra-ui/layout";
import OfferDisplay from "../components/OfferDisplay";
import OfferRedemptionStatus from "../components/OfferRedemptionStatus";

const OfferSelectPage = () => {   

    return (
        <VStack>
            <OfferRedemptionStatus />
            <OfferDisplay />
        </VStack>
    )
}

export default OfferSelectPage;