import { useEffect, useState } from "react"
import { Offer } from "./../../interfaces"
import OfferCard from "../Components/offerCard";
import { Box, Button, Image, List, Text, TextInput } from "grommet";

const OfferList = () => {
    // @ts-ignore
    const env = process.env

    const [offers, setOffers] = useState([])

    const updateOffers = () => {
        

        fetch(env.REACT_APP_API_ENDPOINT + "/offers/list").then((response) => {
            response.json().then((data) => {
                console.log(data)
                setOffers(data)
            })
        })
    }

    useEffect(() => {
        updateOffers();
    }, [])


    return(
        <Box fill="vertical" justify='center' direction="row" wrap={true}>
            {Object.keys(offers).map((key) => {
                const offerData = offers[key]
                const offerImageUrl = env.REACT_APP_API_ENDPOINT + "/image/ascii?image=" + offerData[0].image

                console.log(offerImageUrl)
                return(
                    <OfferCard image_url={offerImageUrl} number_available={offerData.length} group_title={key} />
                )
            })}
        </Box>
    )
}

export default OfferList;