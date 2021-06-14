import useSWR from 'swr'
import ErrorDisplay from "../ErrorDisplay";
import { SpiralSpinner } from "react-spinners-kit"
import { groupBy } from "lodash"
import { SimpleGrid, Text } from "@chakra-ui/react"
import OfferGridCard from './OfferGridCard';
import { useMediaQuery } from 'react-responsive'
import { Link } from 'react-router-dom'

const OfferDisplay = () => {
    const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' })

    if (process.env.REACT_APP_API_ENDPOINT === undefined) throw new Error("API Endpoint not configured")
    const { data, error } = useSWR(process.env.REACT_APP_API_ENDPOINT + '/offers', { refreshInterval: 1000 })

    if (error) return <ErrorDisplay error={"Could not get offers"} />
    if (!data) return <SpiralSpinner backColor="#00ff00" frontColor="green" />

    const offerGroups = groupBy(data, 'title')
    const offerGroupKeys = Object.keys(offerGroups)
    const columns = Math.min(offerGroupKeys.length, isBigScreen ? 3 : 2)

    if(offerGroupKeys.length === 0) {
        return(<Text color="white"> No Offers Available </Text>)
    }
    return(
        <SimpleGrid columns={columns} spacing={10}>
            {offerGroupKeys.map(key => (
                <Link to={"/redeem/" + offerGroups[key][0].offertoken} key={key}>
                    <OfferGridCard title={key} image={offerGroups[key][0].image} quantity={offerGroups[key].length}/>
                </Link>
            ))}
        </SimpleGrid>
    )
    
}

export default OfferDisplay;