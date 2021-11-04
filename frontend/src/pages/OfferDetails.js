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
        <div className="flex flex-row flex-wrap justify-center p-9">
            <div className="flex flex-col justify-middle rounded-lg p-1">
                <div className="bg-pink-900 p-5 rounded-lg m-2 shadow-2xl max-w-md bg-blend-blend">
                    <div>
                        <OfferImage img={offer.image} />
                    </div>

                    <h1 className="text-pink-100 font-bold"> {offer.name} </h1>
                    <h1 className="text-pink-100 mt-3 truncate"> ID: {offer.hash} </h1>
                </div>

                <div className="flex flex-row bg-pink-900 p-5 rounded-lg m-2 shadow-2xl min-w-md justify-center">
                    <OfferClaim hash={hash}/>
                </div>
            </div>
        </div>
    )
}