import { Button, Heading, Text, VStack } from "@chakra-ui/react"

const ErrorDisplay = ({error} : {error: string}) => {
    return(
        <VStack>
            <Heading color="red.400" textAlign="center" size="2x1"> An Error Ocurred</Heading>
            <Text color="red.400">{error}</Text>           
        </VStack>
    )
}

export default ErrorDisplay