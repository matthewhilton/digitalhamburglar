import { useEffect, useState } from "react"
import { Offer } from "./../../interfaces"
import OfferCard from "../Components/offerCard";
import { Box, Button, List, TextInput } from "grommet";

const OfferList = () => {
    const [offers, setOffers] = useState([])
    const [search, setSearch] = useState("")

    const updateOffers = () => {
        // @ts-ignore
        const env = process.env

        console.log("endpoint: ", env)
        fetch(env.REACT_APP_API_ENDPOINT + "/getOffers").then((response) => {
            response.json().then((data) => {
                console.log(data)
                setOffers(data)
            })
        })
    }

    useEffect(() => {
        updateOffers();
    }, [])

    let filteredList = [...offers].filter((offer: Offer) => { 
        if(search === "") return true;
        if(offer.name.toLowerCase().includes(search.toLowerCase())) return true;
    })

    return(
        <Box>
            <Button label="Refresh Offers" primary onClick={updateOffers} margin="small"/>
            <Box margin="medium">
                <TextInput 
                value={search} 
                onChange={(evt) => setSearch(evt.target.value)}
                placeholder="Search"
                />
             </Box>
            <List
            primaryKey="offers"
            data={filteredList}
            children={(item: Offer) => 
                <OfferCard offer={item} key={item.id} />
            }
            /> 
        </Box>
    )
}

export default OfferList;