import { Container, Heading, Text, VStack } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import OfferDisplay from "../components/OfferDisplay";
import OfferRedemptionStatus from "../components/OfferRedemptionStatus";
import { StoreState } from "../redux/store";

const OfferSelectPage = () => {   
    const key = useSelector((state: StoreState) => state.key)
    const validKey = !key.expired

    return (
        <VStack>
            {validKey ? <OfferRedemptionStatus /> : <OfferDisplay />}
        </VStack>
    )
}

export default OfferSelectPage;