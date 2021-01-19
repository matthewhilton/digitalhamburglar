import { useLocation, useHistory} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { OfferCode } from "./../../interfaces"
import bwipjs from "bwip-js"
import { Accordion, AccordionPanel, Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Text } from 'grommet'

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

const OfferRedemption = (props: any) => {
    const query = useQuery();
    const id = query.get("id");
    const propositionId = query.get("propositionId");

    const [code, setCode] = useState<OfferCode | null>(null);
    const [error, setError] = useState<String | null>(null)

    const history = useHistory();

    const loadCodeData = () => {
        setCode(null)
        // @ts-ignore 
        const env = process.env
        fetch(env.REACT_APP_API_ENDPOINT + "/getOfferCode?offerId=" + id + "&propositionId=" + propositionId).then(response => {
            if(response.status == 200){
                response.json().then((data) => {
                    setCode(data)
                })
            } else {
                setError("Error getting redemption code")
            }
        })
    }

    useEffect(() => {
        loadCodeData();
    }, [id, propositionId]);

    useEffect(() => {
        if(code != null){
            const options : bwipjs.ToBufferOptions = {
                bcid: "azteccode",
                text: code.barcodeData
            } 
            bwipjs.toCanvas("codeCanvas", options)
        }
    }, [code])

    return(
        <div>

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
        </div> 
    )
}

export default OfferRedemption;