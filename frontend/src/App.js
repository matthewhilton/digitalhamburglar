import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import OffersList from './pages/OffersList';
import { OffersContextProvider } from './hooks/offersContext';
import { OfferClaimContextProvider } from './hooks/offerClaimContext';
import Typist from 'react-typist';
import OfferDetails from "./pages/OfferDetails";

const cursor = {
  show: true,
  blink: true,
  element: '|',
  hideWhenDone: true,
  hideWhenDoneDelay: 1000,
}

function App() {
  return (
    <OfferClaimContextProvider>
      <OffersContextProvider>
        <div className="flex flex-col mb-10" style={{backgroundColor: "black"}}>
          <Router>
          <Link to="/">
            <div className="justify-items-center">
              <h1 className="text-4xl font-display text-title-100 text-center mt-5"> <Typist cursor={cursor}> <Typist.Delay ms={1000}  /> Digital Hamburglar  </Typist></h1>
            </div>
          </Link>
            <Switch>
              <Route path="/offer/:hash">
                <OfferDetails />
              </Route>
              <Route path="/">
                <OffersList />
              </Route>
            </Switch>
          </Router>
        </div>
    </OffersContextProvider>
   </OfferClaimContextProvider>
  );
}

export default App;
