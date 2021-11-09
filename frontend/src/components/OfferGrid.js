import { OfferImage } from "./OfferImage"
import { groupBy, sample } from "lodash"
import { Link } from "react-router-dom"
import { FaTag } from "react-icons/fa"

export const OfferGrid = ({ offers }) => {

    const offersGrouped = groupBy(offers, 'name')

    return <div className="grid grid-cols-2">
        {Object.keys(offersGrouped).map(offerName => (
            <Link to={`/offer/${sample(offersGrouped[offerName]).hash}`} key={offerName}>
                <div className="bg-gray-200 p-2 m-2 rounded-lg flex-grow">
                    <OfferImage img={offersGrouped[offerName][0].image} />
                    <h2 className="text-white font-bold mt-2"> {offerName} </h2>
                    <div className="flex flex-row gap-3 items-center mt-2">
                        <FaTag className="text-green-500" />
                        <h3 className="text-green-500 font-bold" > {offersGrouped[offerName].length} </h3>
                    </div>
                </div>
            </Link>
        ))}
    </div>
}