import { useState, useEffect } from "react";

export default function Countdown ({to}) {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setSeconds(to)
    }, [to])

    useEffect(() => {
        const x = setInterval(() => {
            if(seconds > 0) {
                setSeconds(seconds - 1)
            }
        }, 1000);

        return () => clearInterval(x);
    })

    return seconds
}