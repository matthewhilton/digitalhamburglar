import { extendTheme } from "@chakra-ui/react"
import { ChakraProvider } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: "Bitter",
    body: "Arial"
  },
  styles: {
    global: {
      body: {
        bg: "black"
      }
    }
  }
})

function MyApp({ Component, pageProps }) {
  return(
    <ChakraProvider theme={theme}>
        <Box m={5} flex={1}>
          <Component {...pageProps} />
        </Box>
    </ChakraProvider>
  )
}

export default MyApp
