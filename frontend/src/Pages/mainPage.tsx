import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Box, Heading, Text, Button, Image} from "grommet";
import { formatDistance } from "date-fns";
import logo from "../matrix_logo.png"

const MainPage = ({children} : { children: React.ReactNode}) => {
    const [stats, setStats] = useState(null)

    const getStats = () => {
        fetch(process.env.REACT_APP_API_ENDPOINT + "/stats").then((response) => {
            response.json().then((data) => {
                setStats(data)
            })
        })
    }

    useEffect(() => {
        getStats();
        const interval = setInterval(() => {
            getStats();
        }, 5000)
        return () => clearInterval(interval);
    }, [])

    return(
        <div style={{height: "100%"}}> 
            <Box align='center' margin="small">
                <Link to="/" style={{textDecoration: "none", color: "black"}}>
                    <Box align="center">
                        <Image src={logo} width={300} fit="contain"/>
                        <Heading>
                            Digital Hamburgler
                        </Heading>
                    </Box>
                </Link>

                <Box fill>
                    <Box pad="medium">
                        <Box direction="row" gap="medium" align="center" justify="around">
                            <Box align="center">
                                <Heading level={2} size='small' textAlign="center">
                                    Last Updated
                                </Heading>
                                {/* @ts-ignore*/}
                                <Text> {stats ? formatDistance(new Date(stats?.lastUpdatedOffers), new Date()) : "---"} ago </Text>
                            </Box>

                            <Box align="center">
                                <Heading level={2} size='small' textAlign="center">
                                    Update Status
                                </Heading>
                                {/* @ts-ignore*/}
                                <Text> {stats ? stats.updateStatus : null} </Text>
                            </Box>
                        </Box>
                    </Box>

                    {children}
                </Box>
            </Box>
        </div>
    )
};

export default MainPage;