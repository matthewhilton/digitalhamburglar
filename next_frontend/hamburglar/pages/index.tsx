import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import OfferImage from '../components/offerImage'

export async function getStaticProps() {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/offers/list`)
  const data = await res.json()

  return {
      props: { data }
  }
}


export default function Home(props) {

  const router = useRouter()

  const goToOffer = (offerKey: string) => {
    // Choose a random offer key (to mitigate collisions between users)
    const offers = props.data[offerKey]
    const selectedOffer = offers[Math.floor(Math.random() * Math.floor(offers.length))] 

    router.push('/offer/' + encodeURIComponent(selectedOffer.externalId))
  }


  return (
    <div className={styles.container}>
      <h1> Digital Hamburglar </h1>

      {Object.keys(props.data).map(offerKey => (
        <div key={offerKey}>   
          <button onClick={() => goToOffer(offerKey)}>{offerKey}</button>
          <OfferImage image={props.data[offerKey][0].image} style={{width: "150px"}} />
        </div>
      ))}
    </div>
  )
}
