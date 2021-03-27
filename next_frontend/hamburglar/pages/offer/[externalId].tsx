import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import OfferImage from '../../components/offerImage'
import OfferRedemption from '../../components/offerRedemption'

const fetcher = url => fetch(url).then(r => r.json())

interface OfferDetails {
    title: string,
    description: string,
    externalId: string,
    expires: string,
    image: string,
    lastchecked: string,
}

const OfferDetails = () => {
    const [offerRedeemOpen, setOfferRedeemOpen] = useState(false)
    const router = useRouter()
    const { externalId } = router.query

    const {data, error} = useSWR(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/offers/details?externalId=${externalId}`, fetcher)

    const offer = data as OfferDetails

    if(data && !error){
        return(
            <div>
                <h1>{offer.title}</h1>
                <p>{offer.description}</p>
                <p> Expires {new Date(offer.expires).toDateString()} </p>
                <OfferImage image={offer.image}/>
                
                { !offerRedeemOpen ? <button onClick={() => setOfferRedeemOpen(true)}> Redeem </button> : <OfferRedemption externalId={externalId as string} /> }
            </div>
        )
    } else {
        return(
            <h1> Error! </h1> 
        )
    }
    
  }
  
  export default OfferDetails