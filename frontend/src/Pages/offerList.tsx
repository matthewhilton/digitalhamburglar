import { useEffect, useState } from "react"
import { Offer } from "./../../interfaces"
import OfferCard from "../Components/offerCard";
import { Box, Button, Image, List, Text, TextInput } from "grommet";
import { useHistory } from 'react-router-dom';

const OfferList = () => {
    // @ts-ignore
    const env = process.env

    const router = useHistory();

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

    const navigateToOffer = (offerTitle: string) => {
        // Choose a random offer from the offers
        const selectedOfferType = offers[offerTitle]

        const ranOfferNum = Math.floor(Math.random() * selectedOfferType.length)

        router.push("/redeem/" + selectedOfferType[ranOfferNum].externalId)
    }

    return(
        <Box fill="vertical" justify='center' direction="row" wrap={true}>
            {Object.keys(offers).map((key) => {
                const offerData = offers[key]
                const offerImageUrl = env.REACT_APP_API_ENDPOINT + "/image/ascii?image=" + offerData[0].image

                console.log(offerImageUrl)
                return(
                    <div onClick={() => navigateToOffer(key)} key={key}>
                        <OfferCard image_url={offerImageUrl} number_available={offerData.length} group_title={key} />
                    </div>
                )
            })}
        </Box>
    )
}

export default OfferList;