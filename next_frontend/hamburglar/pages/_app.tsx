import { extendTheme, Heading } from "@chakra-ui/react"
import { ChakraProvider } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"
import Router from "next/router";
import { useState, useEffect } from "react"

const theme = extendTheme({
  fonts: {
    heading: "Roboto Mono",
    body: "Arial"
  },
  styles: {
    global: {
      body: {
        bg: "black"
      }
    }
  },
  colors: {
    "brand": {
      50: "#00ff00",
      100: "#00ff00",
      500: "#29b329"
    }
  }
})

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  // Make the page components aware when the SSR is loading a page
  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box m={5} flex={1}>
        <Component pageLoading={loading} {...pageProps} />
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
