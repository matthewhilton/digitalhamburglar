import { OffersContext } from "../hooks/offersContext.js";
import { useContext } from "react"
import { OfferGrid } from "../components/OfferGrid.js";
import { OfferClaimContext } from "../hooks/offerClaimContext.js";
import { Link } from "react-router-dom";

export default function OffersList() {
    const { data: offerData, error } = useContext(OffersContext);
    const { offers, claimed } = offerData ? offerData : { offers: null, claimed: null }
    const { claim: offerClaim } = useContext(OfferClaimContext)
    const loading = !offers && !error;

    if(loading) return <h1 className="text-center text-white"> Loading... </h1>
    if(error) return <h1 className="text-center text-white"> {error} </h1>
    
    if(offerClaim) return <OfferClaimNotification hash={offerClaim.offerHash} />

    // Only show unclaimed offers
    const unclaimedOffers = offers.filter(offer => !claimed.includes(offer.hash));
    return <OfferGrid offers={unclaimedOffers} />
}

const OfferClaimNotification = ({hash}) => (
    <div className="flex text-white flex-row justify-center p-5 ">
        <div className="flex gap-3 p-5 rounded-xl bg-pink-800 flex-wrap items-center content-center justify-center max-w-md">
        <p> You have already claimed an offer. You can't claim any more until you use or forfeit your current one. </p>
        <Link to={`/offer/${hash}`}>
            <button className="bg-pink-900 font-bold p-5 rounded-xl"> Go to Offer </button> 
        </Link>
        </div>
    </div>
)