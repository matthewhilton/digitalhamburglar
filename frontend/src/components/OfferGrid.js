import { OfferImage } from "./OfferImage"
import { groupBy, sample } from "lodash"
import { Link } from "react-router-dom"

export const OfferGrid = ({ offers }) => {

    const offersGrouped = groupBy(offers, 'name')

    return <div className="flex flex-row flex-wrap justify-center">
        {Object.keys(offersGrouped).map(offerName => (
            <Link to={`/offer/${sample(offersGrouped[offerName]).hash}`} key={offerName}>
                <div className="bg-pink-900 m-8 max-w-xs p-4 rounded-lg shadow-xl justify-middle">
                    <OfferImage img={offersGrouped[offerName][0].image} />
                    <h2 className="text-pink-100 font-bold overflow-ellipsis"> {offerName} </h2>
                </div>
            </Link>
        ))}
    </div>
}