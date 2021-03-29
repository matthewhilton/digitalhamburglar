import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
        <style global jsx>{`
          html,
          body {
            margin: 0;
            background-color: black;
          }
          #next {
            background: blue;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        `}</style>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;700&family=Work+Sans:wght@700&display=swap" rel="stylesheet" /> 
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
