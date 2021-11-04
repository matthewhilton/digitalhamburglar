import { createContext } from "react";
import useLocalStorage from "./useLocalStorage";

const OfferClaimContext = createContext({
    claim: null,
    setClaim: () => {}
});

const OfferClaimContextProvider = ({children}) => {
    
    const [claim, setClaim] = useLocalStorage("offerClaim", null)

    return <OfferClaimContext.Provider value={{claim, setClaim}}>
        {children}
    </OfferClaimContext.Provider>
}

export { OfferClaimContextProvider, OfferClaimContext };