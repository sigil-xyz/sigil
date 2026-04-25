import 'nextra-theme-docs/style.css'
import './globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="sigil-docs-root">
      <Component {...pageProps} />
    </div>
  )
}
