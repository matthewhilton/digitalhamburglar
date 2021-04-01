import { Text, Box, Container} from '@chakra-ui/react'
import { Img } from 'react-image'
import { FlagSpinner } from 'react-spinners-kit'
import { getOfferImagesPath } from '../functions/getOfferImagePath'

interface RestProps {
    style?
}

const ImageError = () => (
    <Box p={3} bg="gray.800" borderRadius="lg">
        <Text color="orange" fontWeight="bold"> Image couldn't be loaded </Text>
    </Box>
)

const OfferImage = ({image, ...restProps}: { image: string} & RestProps) => {
    const offerPaths = getOfferImagesPath(image)

    // Initially use cdn path (to avoid unneccessary function invocations)
    // but fallback to function path if that doesn't work (for example if it doesn't exist)
    return(
        <Img 
        src={[offerPaths.cdn, offerPaths.func]} 
        loader={<Container width="200px" height="200px"><FlagSpinner color="green" /></Container>}
        unloader={<ImageError />}
        />
    )
}

export default OfferImage;