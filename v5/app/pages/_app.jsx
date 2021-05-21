import '../styles/normalize.css';
import '../styles/style.css';
import '../styles/custom.css';
import NextNprogress from 'nextjs-progressbar-withdelay';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNprogress height={2} startDelayMs={200} options={{ easing: 'ease', speed: 500 }} />
      <Component {...pageProps} />
    </>
  );
}
