import { useParams, useHistory} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { OfferCode } from "./../../interfaces"
import bwipjs from "bwip-js"
import { Accordion, AccordionPanel, Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Image, Text } from 'grommet'

interface Details {
    title: string
    description: string
    externalId: string
    expires: string
    image: string
    lastChecked: string
}

const OfferRedemption = (props: any) => {
    let params: { externalId } = useParams();
    const externalId = params.externalId

    const [code, setCode] = useState<OfferCode | null>(null);
    const [details, setDetails] = useState<Details | null>(null);
    const [error, setError] = useState<String | null>(null)

    const history = useHistory();

    const loadCodeData = () => {
        setCode(null)
        // @ts-ignore 
        const env = process.env

        if(externalId != null){
            fetch(env.REACT_APP_API_ENDPOINT + "/offers/redeem?externalId=" + externalId).then(response => {
                if(response.status == 200){
                    response.json().then((data) => {
                        setCode(data)
                    })
                } else {
                    setError("Error getting redemption code")
                }
            })

            fetch(env.REACT_APP_API_ENDPOINT + "/offers/details?externalId=" + externalId).then(response => {
                if(response.status == 200){
                    response.json().then((data) => {
                        setDetails(data)
                    })
                } else {
                    setError("Error getting offer details")
                }
            })
        } else {
            // TODO something
            alert("URL Malformed")
        }       
    }

    useEffect(() => {
        loadCodeData();
    }, [externalId]);

    useEffect(() => {
        if(code != null){
            const options : bwipjs.ToBufferOptions = {
                bcid: "azteccode",
                text: code.barcodeData
            } 
            //bwipjs.toCanvas("codeCanvas", options)
        }
    }, [code])

    return(
        <div>
            
            <Box direction="row" justify="center" gap="small">
                <Box width="small">
                    <Image src={process.env.REACT_APP_API_ENDPOINT + "/image/ascii?image=" + details?.image} />
                </Box>
                <Box width="small">
                    <Text weight="bold" color="brand">{details?.title}</Text>
                    <Text color="brand"> Expires {new Date(details?.expires || '').toDateString()} </Text>
                </Box>
            </Box>
        {
            /*
 <Box>
                <Card background="light-1" pad="small" align="center">
                    <CardHeader>
                        <Heading>{code?.code}</Heading> 
                    </CardHeader>
                    <CardBody>
                        <canvas id="codeCanvas" style={{width: '100%', height: '100%', maxWidth: 300, maxHeight: 300}} />
                    </CardBody>
                    <CardFooter pad="small">
                        <Button primary onClick={loadCodeData} disabled={code===null} label="Refresh Code" /> 
                    </CardFooter>
               </Card>
            </Box>

            {error != null ? <Text> {error} </Text> : null }
            <Accordion>
                <AccordionPanel label="Not working?">
                    <Box pad="medium" background="light-2">
                        <Text>
                            Someone else might have requested a code for this offer recently, overriding the one you currently see on your page. 
                            To fix this refresh the code, or select a different offer.
                        </Text>
                        <Box direction="row" gap="small">
                            <Button primary onClick={loadCodeData} disabled={code===null} label="Refresh Code" /> 
                            <Button onClick={() => history.push("/")} label="Select Another Offer" />
                        </Box>
                    </Box>
                </AccordionPanel>
            </Accordion>
            */
        }
           
        </div> 
    )
}

export default OfferRedemption;