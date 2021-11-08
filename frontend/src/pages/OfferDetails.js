import { useParams } from "react-router-dom"
import { useContext } from "react";
import { OffersContext } from "../hooks/offersContext";
import { OfferImage } from "../components/OfferImage";
import OfferClaim from "../components/OfferClaim";

export default function OfferDetails() {
    const { data: offersData } = useContext(OffersContext);
    const offers = offersData ? offersData.offers : null;
    const { hash } = useParams();

    const filteredOffers = offers ? offers.filter(offer => offer.hash === hash) : null
    const offer = filteredOffers && filteredOffers.length > 0 ? filteredOffers[0] : null;

    if (!offer && offers) return <h1> Error finding offer </h1>
    if (!offer && !offers) return <h1> Loading... </h1>

    return (
        <div className="flex-row m-5">
            <div className="flex flex-col bg-gray-200 max-w-md p-4 mt-6 rounded-lg shadow-xl justify-center m-auto">
                <OfferImage img={offer.image} />
                <h1 className="text-white font-bold text-xl mt-3"> {offer.name} </h1>
                <h1 className="text-green-400 mt-3 truncate"> {offer.hash} </h1>
            </div>

            <div className="flex flex-row bg-gray-200 p-2 max-w-md rounded-lg mt-5 shadow-2xl min-w-md justify-center m-auto">
                <OfferClaim hash={hash}/>
            </div>
        </div>
    )
}