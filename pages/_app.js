import '../styles/globals.css'
import Layout from './components/Layout'

function MyApp({ Component, pageProps }) {
  return(
    <div>
        <Component {...pageProps} />
    </div>
  )
}

export default MyApp
