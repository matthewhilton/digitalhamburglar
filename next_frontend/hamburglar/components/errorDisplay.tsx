import { Button, Heading, Text, VStack } from "@chakra-ui/react"
import Link from "next/link"

const ErrorDisplay = ({error, showButton=true} : {error: string, showButton?: boolean}) => {
    return(
        <VStack>
            <Heading color="red.400" textAlign="center" size="2x1"> An Error Ocurred</Heading>
            <Text color="red.400">{error}</Text>

            {showButton && 
                <Link href="/">
                    <Button colorScheme="white"> Back to Home </Button>
                </Link>
            }
            
        </VStack>
    )
}

export default ErrorDisplay