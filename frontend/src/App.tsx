import { HashRouter as Router, Route, Switch } from "react-router-dom"
import OfferList from './Pages/offerList';
import './index.css';
import OfferRedemption from "./Pages/offerRedemption";
import MainPage from "./Pages/mainPage";
import { Grommet } from "grommet";

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
    colors: {
      brand: "#0d9e33"
    }
  },
};



function App() {
  return (
    <Grommet theme={theme}>
      <Router>
        <MainPage>
        
          <Switch>
            <Route path="/redeem">
              <OfferRedemption />
            </Route>
            <Route path="/">
              <OfferList />
            </Route>
          </Switch>
          
        </MainPage>
        </Router>
    </Grommet>
  );
}

export default App;
