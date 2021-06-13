import { Container, Text, HStack } from "@chakra-ui/react"
import { IoPricetag } from "react-icons/io5";
import OfferImage from "./OfferImage";

interface Props {
    title: string,
    image: string,
    quantity: number,
}

const OfferGridCard = ({title, image, quantity}: Props) => (
    <Container bg="gray.900" p={3} borderRadius="lg" centerContent>
        <OfferImage image={image} style={{width: "300px"}} />
        <Text color="gray.100" fontWeight="bold" noOfLines={4} p={1}>{title}</Text>
        <HStack justify="start" direction="row" align="center" width="100%">
            <IoPricetag color="green" />
            <Text color="green" fontWeight="semibold">{quantity} code{quantity > 1 ? 's' : null}</Text>
        </HStack>
    </Container>
)

export default OfferGridCard;