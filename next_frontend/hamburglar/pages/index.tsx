import { Heading, Container, Center } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import OfferGrid from '../components/offerGrid'
import OfferImage from '../components/offerImage'
import { ApiResponse } from '../interfaces/apiInterfaces'
import { GuardSpinner } from "react-spinners-kit";

export async function getServerSideProps() {
  const res = await fetch(`${process.env.API_ENDPOINT}/offers/list/groups`)
  const errorCode = res.ok ? false : res.status
  const json = await res.json()

  return { props: { error: errorCode ? json : null, data: !errorCode ? json : null } as ApiResponse } 
}

export default function Home(props) {
return (
    <Container maxW="container.md" centerContent={true}>
      <Heading color="brand.50" fontWeight="extrabold" marginBottom={3} textAlign="center"> Digital Hamburglar </Heading>
      {props.pageLoading ? 
        <Center marginTop="20px">
          <GuardSpinner backColor="#00ff00" frontColor="green" />
        </Center> 
        :  
        <OfferGrid offerGroups={props.data}/>}
    </Container>
  )
}
