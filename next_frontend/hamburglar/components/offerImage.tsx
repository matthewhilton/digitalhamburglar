import { Image } from "@chakra-ui/react"

interface RestProps {
    style?
}

const OfferImage = ({image, ...restProps}: { image: string} & RestProps) => {
    {
        // Offer images are disable temporarily 
    }
    return(
        <Image src={"/placeholder.png"} {...restProps} borderRadius="5px"/>
    )
}

export default OfferImage;