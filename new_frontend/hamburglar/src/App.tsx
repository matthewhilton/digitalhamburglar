import { Container, extendTheme, Heading } from "@chakra-ui/react"
import { ChakraProvider } from "@chakra-ui/react"
import OfferSelectPage from "./pages/OfferSelectPage"
import { BrowserRouter as Router,
          Switch,
          Route } from "react-router-dom"
import OfferRedemptionPage from "./pages/OfferRedemptionPage"
import { Provider } from "react-redux"
import store from "./redux/store"
import OfferRedemptionIntegrity from "./components/OfferRedemptionIntegrity"
import { PersistGate } from 'redux-persist/integration/react'

const theme = extendTheme({
  fonts: {
    heading: "Roboto Mono",
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

const App = () => (
  <Router>
    
      <Provider store={store.store}>
        <PersistGate persistor={store.persistor}>
          <ChakraProvider theme={theme}>
            <Container maxW="container.md" centerContent={true} p={5}>
                  <OfferRedemptionIntegrity />
                  <Heading color="brand.50" fontWeight="extrabold" marginBottom={3} textAlign="center"> Digital Hamburglar </Heading>
                  
                  <Switch>
                    <Route path="/redeem/:token">
                      <OfferRedemptionPage />
                    </Route>

                    <Route path="/">
                      <OfferSelectPage />
                    </Route>

                  </Switch>
              </Container>
          </ChakraProvider>
        </PersistGate>
      </Provider>

  </Router>
)

export default App;
