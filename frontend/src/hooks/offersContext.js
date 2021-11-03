import { createContext, useEffect, useState } from "react";

const OffersContext = createContext(null);

const OffersContextProvider = ({children}) => {
    const [res, setRes] = useState({data: null, error: null})

    useEffect(async () => {
        try {
            const res = await fetch('https://hamburglarapi.azure-api.net/hamburglarv4/offers');
            const json = await res.json();

            if(res.status !== 200) {
                setRes({data: null, error: json});
                return;
            }
    
            setRes({data: json, error: null});
        } catch (err) {
            setRes({data: null, error: err.message});
        }
        
    }, [])

    return <OffersContext.Provider value={res}>
        {children}
    </OffersContext.Provider>
}

export { OffersContextProvider, OffersContext };