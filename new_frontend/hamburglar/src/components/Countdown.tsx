import { Heading, Text, VStack } from "@chakra-ui/layout"
import { useEffect, useState } from "react"
import useInterval from "../functions/useInterval"

interface Props {
    to: Date
    onFinish?: (() => void)
}

const Countdown = ({to, onFinish}: Props) => {
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [callbackRun, setCallbackRun] = useState(false)

    useEffect(() => {
        const now = new Date();
        const secondsTo = Math.max(0, Math.floor(Math.abs((to.getTime() - now.getTime()) / 1000)))
        setCallbackRun(false)
        setSecondsLeft(secondsTo)
    }, [to])

    useInterval(() => {
        // Run optional callback
        if(secondsLeft === 0 && onFinish && !callbackRun) {
            setCallbackRun(true)
            onFinish();
        }
        if(secondsLeft > 0) return setSecondsLeft(secondsLeft - 1)
        if(secondsLeft <= 0) return setSecondsLeft(0)
    }, 1000)

    return (
        <VStack>
            <Heading as="h2" size="sm" color="white"> Time Remaining: </Heading>
            <Text color="white"> {secondsLeft} s </Text>
        </VStack>
    )
    
}

export default Countdown;