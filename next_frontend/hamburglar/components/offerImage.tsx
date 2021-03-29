import { Image } from "@chakra-ui/react"

interface RestProps {
    style?
}

const OfferImage = ({image, ...restProps}: { image: string} & RestProps) => {
    return(
        <Image src={`/api/image/ascii/?image=${image}`} {...restProps} borderRadius="5px" />
    )
}

export default OfferImage;