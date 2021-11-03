import { OffersContext } from "../hooks/offersContext.js";
import { useContext } from "react"
import { OfferGrid } from "../components/OfferGrid.js";

export default function OffersList() {
    const { data: offers, error } = useContext(OffersContext);
    const loading = !offers && !error;

    if(loading) return <h1> Loading... </h1>
    if(error) return <h1> {error} </h1>
    
    return <OfferGrid offers={offers} />
}