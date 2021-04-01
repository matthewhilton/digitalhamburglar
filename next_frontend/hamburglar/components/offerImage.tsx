import { Text, Box, Container} from '@chakra-ui/react'
import { Img } from 'react-image'
import { FlagSpinner } from 'react-spinners-kit'

interface RestProps {
    style?
}

const ImageError = () => (
    <Box p={3} bg="gray.800" borderRadius="lg">
        <Text color="orange" fontWeight="bold"> Image couldn't be loaded </Text>
    </Box>
)

const OfferImage = ({image, ...restProps}: { image: string} & RestProps) => {
    return(
        <Img 
        src={image} 
        loader={<Container width="200px" height="200px"><FlagSpinner color="green" /></Container>}
        unloader={<ImageError />}
        />
    )
}

export default OfferImage;