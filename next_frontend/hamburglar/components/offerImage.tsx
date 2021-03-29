interface RestProps {
    style?
}

const OfferImage = ({image, ...restProps}: { image: string} & RestProps) => {

    return(
        <img src={`${process.env.NEXT_PUBLIC_API_ENDPOINT}/image/ascii/?image=${image}`} {...restProps} />
    )
}

export default OfferImage;