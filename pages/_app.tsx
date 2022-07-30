import '../styles/globals.css'
import 'antd/dist/antd.css';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { MessageProvider } from '../components/provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
          <Head>
        <meta charSet="utf-8" />
        <title>Online Education</title>
        <meta key="description" name="description" content="Online Education System" />
        {/* Distribution implementation by amap*/}
        {/* <script
          src={`//webapi.amap.com/maps?v=1.4.15&key=${key}&plugin=Map3D,AMap.DistrictLayer `}
        ></script> */}
      </Head>
      <MessageProvider>
        <Component {...pageProps} />
      </MessageProvider>
    
    </>
    
  )
}

export default MyApp
