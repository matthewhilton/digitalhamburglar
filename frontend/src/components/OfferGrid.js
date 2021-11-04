import { OfferImage } from "./OfferImage"
import { groupBy, sample } from "lodash"
import { Link } from "react-router-dom"
import { FaTag } from "react-icons/fa"

export const OfferGrid = ({ offers }) => {

    const offersGrouped = groupBy(offers, 'name')

    return <div className="flex flex-row flex-wrap justify-center">
        {Object.keys(offersGrouped).map(offerName => (
            <Link to={`/offer/${sample(offersGrouped[offerName]).hash}`} key={offerName}>
                <div className="bg-pink-900 m-8 max-w-xs p-4 rounded-lg shadow-xl justify-middle">
                    <OfferImage img={offersGrouped[offerName][0].image} />
                    <h2 className="text-white font-bold overflow-ellipsis mt-2"> {offerName} </h2>
                    <div className="flex flex-row gap-3 items-center mt-2">
                        <FaTag className="text-pink-300" />
                        <h3 className="text-pink-300 font-bold" > {offersGrouped[offerName].length} </h3>
                    </div>
                </div>
            </Link>
        ))}
    </div>
}