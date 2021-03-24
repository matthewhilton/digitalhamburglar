import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Box, Heading, Text, Button, Image} from "grommet";
import logo from '../images/hamburglar_ascii.png'

const MainPage = ({children} : { children: React.ReactNode}) => {
    return(
        <div style={{height: "100%"}}> 
                <Box margin="large" align="center" alignContent="stretch"  fill="vertical">
                    <Box width={{min: 'small', max: "large"}} fill="vertical">
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