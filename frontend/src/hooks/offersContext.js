import { createContext } from "react";
import useSWR from 'swr'
import fetch from 'unfetch'

const fetcher = url => fetch(url).then(r => r.json())

const OffersContext = createContext(null);

const OffersContextProvider = ({children}) => {
    const { data, error } = useSWR('https://hamburglarapi.azure-api.net/hamburglarv4/offers', fetcher)

    const res = {
        data, error
    }

    return <OffersContext.Provider value={res}>
        {children}
    </OffersContext.Provider>
}

export { OffersContextProvider, OffersContext };