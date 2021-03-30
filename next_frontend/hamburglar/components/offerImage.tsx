import { Image } from "@chakra-ui/react"

interface RestProps {
    style?
}

const OfferImage = ({image, ...restProps}: { image: string} & RestProps) => {
    return(
        <Image src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/image/ascii/?image=${image}`} {...restProps} borderRadius="5px" />
    )
}

export default OfferImage;