import { Offer } from "./../../interfaces";
import { useHistory } from "react-router-dom"
import { Box, Button} from "grommet";

const OfferCard = ({offer}: {offer: Offer}) => {

    const history = useHistory();

    const redeemOffer = (offer: Offer) => {
        history.push("/redeem?id=" + offer.id + "&propositionId=" + offer.propositionId)
    }

    return(
        <Box style={{flexDirection: "row", justifyContent: "space-between"}}>
            {offer.name}
            <Button onClick={() => redeemOffer(offer)} primary size="small" label="Get Redemption Code" />
        </Box>
    )
}

export default OfferCard;