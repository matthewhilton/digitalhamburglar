import { OffersContext } from "../hooks/offersContext.js";
import { useContext } from "react"
import { OfferGrid } from "../components/OfferGrid.js";
import { OfferClaimContext } from "../hooks/offerClaimContext.js";
import { Link } from "react-router-dom";
import { FillSpinner } from "react-spinners-kit";

export default function OffersList() {
    const { data: offerData, error } = useContext(OffersContext);
    const { offers, claimed } = offerData ? offerData : { offers: null, claimed: null }
    const { claim: offerClaim } = useContext(OfferClaimContext)
    const loading = !offers && !error;

    if (loading) return <div className="flex flex-row justify-center mt-5 gap-3"> <h1 className="text-title-100"> Loading... </h1> <FillSpinner color="#1bf298" /></div>
    if (error) return <h1 className="text-center text-white"> {error} </h1>

    if (offerClaim) return <OfferClaimNotification hash={offerClaim.offerHash} />

    // Only show unclaimed offers
    const unclaimedOffers = offers.filter(offer => !claimed.includes(offer.hash));
    return <div className="flex flex-row justify-center mt-5">
        <div className="flex max-w-lg flex-row">
            <OfferGrid offers={unclaimedOffers} />
        </div>
    </div>
}

const OfferClaimNotification = ({ hash }) => (
    <div className="flex text-white flex-row justify-center p-5 ">
        <div className="flex gap-3 p-5 rounded-xl bg-gray-200 flex-wrap items-center content-center justify-center max-w-md">
            <p> You have already claimed an offer. You can't claim any more until you use or forfeit your current one. </p>
            <Link to={`/offer/${hash}`}>
                <button className="bg-green-700 font-bold p-5 rounded-xl"> Go to Offer </button>
            </Link>
        </div>
    </div>
)