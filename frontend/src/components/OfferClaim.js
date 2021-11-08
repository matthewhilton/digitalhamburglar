import { OfferClaimContext } from "../hooks/offerClaimContext"
import { useContext, useState } from "react"
import { FaBolt } from "react-icons/fa";
import OfferCode from "./OfferCode";
import { OffersContext } from "../hooks/offersContext";
import { Link } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";

export default function OfferClaim({ hash }) {
    const { claim: offerClaim, setClaim: setOfferClaim } = useContext(OfferClaimContext)
    const { data: offerData } = useContext(OffersContext);
    const [claimError, setClaimError] = useState(null);

    const alternativeOffers = offerData ? offerData.offers.filter(offer => offer.hash !== hash) : [];

    useEffect(() => {
        setClaimError(null)
    }, [hash])

    const unClaimOffer = async () => {
        setOfferClaim(null);

        if(offerClaim != null) {
            // request server to forfeit the offer claim
            await fetch(`https://hamburglarapi.azure-api.net/hamburglarv4/discard?claimKey=${offerClaim.id}`);
        } 
    }

    const claimOffer = async () => {
        setOfferClaim(null);
        const res = await fetch(`https://hamburglarapi.azure-api.net/hamburglarv4/claim?offerHash=${hash}`);
        const json = await res.json();

        if (res.ok) {
            setOfferClaim(json);
        } else {
            setClaimError(json.error);
            setOfferClaim(null);
        }
    }

    if (claimError) return <div>
        <h1 className="text-center text-white"> {claimError} </h1>
        {
            // If there is another of the same offer, offer to redirect to claim that one
        }
        {alternativeOffers.length > 0 && <Link to={`/offer/${alternativeOffers[0].hash}`}> <button> Try another of the same offer </button> </Link>}
    </div>

    // No offer claim, show button
    if (!offerClaim) return (
        <button className="bg-green-700 rounded-lg text-white font-bold shadow-xl p-4 m-5 bg-blend-lighten active:bg-green-800" onClick={claimOffer}>
            <div className="flex flex-row justify-items-center content-center items-center gap-4">
                <p> Claim Offer </p>
                <FaBolt style={{ height: 25 }} />
            </div>
        </button>
    )

    // Offer claim - show code.
    if (offerClaim) return (
        <div className="flex flex-col justify-items-center content-center items-center gap-4 max-w-xs">
            <h2 className="text-white font-bold text-xl mt-5"> Your Offer Code </h2>
            <OfferCode claim={offerClaim} onDeleteClaim={() => unClaimOffer()}/>
        </div>
    )
}