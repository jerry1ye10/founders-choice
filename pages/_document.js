import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <title>Founder's Choice</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
            <link
                href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
                rel="stylesheet"
            />

            <meta
              name="description"
              content="A VC firm ranking generated, anonymously and verifiably, for founders, by founders."
            />
            <meta name="author" content="Founder's Choice" />

          <meta property="og:site_name" content="Founder's Choice" />
            <meta property="og:title" content="Founder's Choice" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL} />
            <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/social-preview.png`} />
            <meta property="og:image:alt" content="Founder's Choice Logo" />
          <meta property="og:description" content="A VC firm ranking generated, anonymously and verifiably, for founders, by founders." />

            <meta 
              property="twitter:description" 
              content="A VC firm ranking generated, anonymously and verifiably, for founders, by founders."
            />
            <meta property="twitter:title" content="Founder's Choice" />
            <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/social-preview.png`} />
            <meta property="twitter:image:alt" content="Founder's Choice Logo" />
            <meta property="twitter:card" content="summary" />
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
