import React from 'react'
import OfferGrid from "../components/offerGrid"
import { Meta } from '@storybook/react';
import { ChakraProvider, extendTheme, Container } from '@chakra-ui/react';
import placeholderImage from "../public/placeholder.png"
import Home from "../pages/index.tsx"

export default {
  title: 'Components/OfferGrid',
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#000000"}
      ]
    }
  },
  component: Home,
} as Meta;

const theme = extendTheme({
  fonts: {
    heading: "Arial",
    body: "Arial"
  },
  styles: {
    global: {
      body: {
        bg: "black"
      }
    }
  },
  colors: {
    "brand": {
      50: "#00ff00",
      100: "#00ff00",
      500: "#29b329"
    }
  }
})


const threeOfferGroups = [{"title":"$8 for 2 Small Quarter Pounder Meals\nToday only! Grab a mate, and enjoy a delicious combo at an unmissable price.","image":placeholderImage,"count":1,"hash":"9ea9d59d0cee6b1fe9af2a0c84f7f227477cd8935090c2eb28ce6fbab186e47e"},{"title":"$4 Cheeseburger Meal & Extra Cheeseburger\nBust the hunger! $4 for a small Cheeseburger meal with an extra Cheeseburger, available for a limited time.","image":placeholderImage,"count":4,"hash":"3a581fd847eb1eaf9f52bdc48ceff0e0e78a7149567d90c135d6e9c1e9c34050"},{"title":"$9 for 2 Small Big Mac Meals\nGrab a mate, and enjoy a delicious combo at an unmissable price. ","image":placeholderImage,"count":1,"hash":"90363b9e41e6d7454d2b55b2b2a07591797da5b66d0fb7ef1cb17910afaa46ed"}]

export const EmptyGrid: React.VFC<{}> = () => 
<ChakraProvider theme={theme}>
  <Container maxW="container.md" centerContent={true}>
    <OfferGrid offerGroups={[]}/>
  </Container>
</ChakraProvider>

export const OneElement: React.VFC<{}> = () => 
<ChakraProvider theme={theme}>
  <Container maxW="container.md" centerContent={true}>
    <OfferGrid offerGroups={[threeOfferGroups[0]]}/>
  </Container>
</ChakraProvider>

export const ThreeElements: React.VFC<{}> = () => 
<ChakraProvider theme={theme}>
  <Home pageLoading={false} data={threeOfferGroups} />
</ChakraProvider>