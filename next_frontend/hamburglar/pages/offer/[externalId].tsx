import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import OfferImage from '../../components/offerImage'
import OfferRedemption from '../../components/offerRedemption'
import { ApiResponse, OfferDetails } from '../../interfaces/apiInterfaces'

export const getServerSideProps = async (context) => {
    if(!context.params){
        // No externalID given, return error
        return { props: { error: "No externalId given", data: null } as ApiResponse } 
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/offers/details?externalId=${context.params.externalId}`)
    const errorCode = res.ok ? false : res.status
    const json = await res.json()
    
    return { props: { error: errorCode ? json : null, data: !errorCode ? json : null } as ApiResponse } 
  }

const OfferInformationPage = ({ data, error }: ApiResponse) => {
    const [offerRedeemOpen, setOfferRedeemOpen] = useState(false)

    if(data && !error){
        const offer = data as OfferDetails
        return(
            <div>
                <h1>{offer.title}</h1>
                <p>{offer.description}</p>
                <p> Expires {new Date(offer.expires).toDateString()} </p>
                <OfferImage image={offer.image}/>
                
                { !offerRedeemOpen ? <button onClick={() => setOfferRedeemOpen(true)}> Redeem </button> : <OfferRedemption externalId={offer.externalId as string} /> }
            </div>
        )
    } else {
        return(
            <h1> {error} </h1> 
        )
    }
    
  }
  
  export default OfferInformationPage