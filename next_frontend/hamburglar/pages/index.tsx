import { Heading, Container } from '@chakra-ui/layout'
import { useRouter } from 'next/router'
import OfferGrid from '../components/offerGrid'
import OfferImage from '../components/offerImage'
import { ApiResponse } from '../interfaces/apiInterfaces'

export async function getStaticProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/offers/list/groups`)
  const errorCode = res.ok ? false : res.status
  const json = await res.json()
  
  return { props: { error: errorCode ? json : null, data: !errorCode ? json : null } as ApiResponse } 
}

export default function Home(props) {
return (
    <Container maxW="container.md" centerContent={true}>
      <Heading bgGradient="linear(to-t, #0f1,#0bffaf)" fontWeight="extrabold" bgClip="text" marginBottom={3}> Digital Hamburglar </Heading>
      <OfferGrid offerGroups={props.data}/>
    </Container>
  )
}
