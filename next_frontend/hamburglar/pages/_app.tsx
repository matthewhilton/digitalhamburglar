import { extendTheme } from "@chakra-ui/react"
import { ChakraProvider } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: "Bitter",
    body: "Arial"
  },
})

function MyApp({ Component, pageProps }) {
  return(
    <ChakraProvider theme={theme}>
      <Box background="black">
        <Box m={5} flex={1}>
          <Component {...pageProps} />
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default MyApp
