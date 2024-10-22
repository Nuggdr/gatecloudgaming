import { AppProps } from 'next/app'; // Importa os tipos do Next.js
import '../styles/styles.css'; // Importa o CSS global do Tailwind

export default function MyApp({ Component, pageProps }: AppProps) { // Define os tipos de AppProps
  return <Component {...pageProps} />;
}
