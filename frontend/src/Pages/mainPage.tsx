import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Box, Heading, Text, Button, Image} from "grommet";
import logo from '../images/hamburglar_ascii.png'
import { useMediaQuery } from 'react-responsive'

const MainPage = ({children} : { children: React.ReactNode}) => {

    const isBigScreen = useMediaQuery({ query: '(min-device-width: 1000px)' })

    return(
        <div style={{height: "100%"}}> 
            <Box margin="large" align="center" alignContent="stretch"  fill="vertical">
                <Box width={isBigScreen ? "large" : "medium"}>
                <Link to="/" style={{textDecoration: "none", color: "black"}}>
                    <Box align="center">
                        <Image src={logo} width={300} fit="contain"/>
                    </Box>
                </Link>
                {children}
                </Box>
            </Box>
        </div>
    )
};

export default MainPage;