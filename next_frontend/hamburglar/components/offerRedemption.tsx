import { useEffect, useState } from "react";
import bwipjs from "bwip-js"

const fetcher = url => fetch(url).then(r => r.json())

interface OfferResponse {
    error: string | null
    data: null | {
        code: string,
        barcodeData: string,
        expirationTime: string,
    }
}

const OfferRedemption = ({externalId}: {externalId: string}) => {
    const [offer, setOffer] = useState<OfferResponse | null>({ error: null, data: null})

    useEffect(() => {
        fetch(`/api/offers/redeem?externalId=${externalId}`)
        .then(res => res.json())
        .then(data => setOffer({
            error: null,
            data: data
        }))
        .catch(() => setOffer({
            error: "Error getting redemption code",
            data: null
        }))
    }, [externalId, setOffer])

    useEffect(() => {
        if(offer.data){
            const options : bwipjs.ToBufferOptions = {
                bcid: "azteccode",
                text: offer.data.barcodeData
            } 
            bwipjs.toCanvas("codeCanvas", options)
        }
    }, [offer.data])

    if(offer.data && !offer.error){
        return(
            <div>
                <h1> {offer.data.code} </h1>
                <canvas id="codeCanvas" style={{width: '100%', height: '100%', maxWidth: 300, maxHeight: 300}} />
            </div>
        )
    } else if(offer.error) {
        return(
            <h1> Error! </h1>
        )
    } else {
        return(
            <h1> Loading </h1>
        )
    }
}

export default OfferRedemption