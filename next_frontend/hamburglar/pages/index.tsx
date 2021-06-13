import { Heading, Container, Center } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import OfferGrid from '../components/offerGrid'
import OfferImage from '../components/offerImage'
import { ApiResponse } from '../interfaces/apiInterfaces'
import { GuardSpinner } from "react-spinners-kit";
import ErrorDisplay from '../components/errorDisplay'
import { groupBy } from "lodash"

export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.API_ENDPOINT}/offers`)
    const errorCode = res.ok ? false : res.status
    const json = await res.json()

    const groupedOffers = groupBy(json, 'title')
  
    return { props: { error: errorCode ? json : null, data: !errorCode ? groupedOffers : null } as ApiResponse } 
  } catch(err) {
    console.error("Could not get server side props")
    console.error(err)
    return { props: { error: "Could not get offers", data: null } as ApiResponse}
  }
}

export default function Home(props) {
  console.log(props.data)
return (
    <Container maxW="container.md" centerContent={true}>
      <Heading color="brand.50" fontWeight="extrabold" marginBottom={3} textAlign="center"> Digital Hamburglar </Heading>
      {props.error ? <ErrorDisplay error={JSON.stringify(props.error)} showButton={false}/> : <>
        {props.pageLoading ? 
          <Center marginTop="20px">
            <GuardSpinner backColor="#00ff00" frontColor="green" />
          </Center> 
          :  
          <OfferGrid offerGroups={props.data}/>}
      </>}
      
    </Container>
  )
}
