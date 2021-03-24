import { Box, Button, Image, Text} from "grommet";

interface Props {
    image_url: string;
    group_title: string;
    number_available: number;
}

const OfferCard = (props: Props) => {
    return(
        <Box width="150px" flex={{"grow": 0}} margin='10px'>
            <Image src={props.image_url} />
            <Text color="brand" size="small" textAlign='center' weight="bold" truncate={true}> {props.group_title} </Text>
            <Text color="brand" size="xsmall" textAlign='center' > {props.number_available} code(s) available</Text>
        </Box>
    )
}

export default OfferCard;