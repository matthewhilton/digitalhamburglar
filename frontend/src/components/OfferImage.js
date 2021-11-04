export const OfferImage = ({img}) => {
    return <img src={`https://hamburglarapi.azure-api.net/hamburglarv4/offer/image?image=${img}`} className="rounded" alt=""/>
  //return <img src={`http://localhost:7071/api/OfferAsciify?image=${img}`} alt=""/>
}