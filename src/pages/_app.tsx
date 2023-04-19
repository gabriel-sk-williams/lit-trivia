import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../styles/theme';
import { RainbowKitProvider, getDefaultWallets, midnightTheme } from '@rainbow-me/rainbowkit';
import { mainnet, goerli, configureChains, createClient, WagmiConfig, useSigner } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import dynamic from "next/dynamic";

const { chains, provider, webSocketProvider } = configureChains(
  [
    mainnet, // goerli,
  ],
  [
    alchemyProvider({
      apiKey: 'x8UX-Y4rDLURAmJZDGm87Uh2m3ZH6hba',
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function App({ Component, pageProps }: AppProps) {

  const Page = dynamic(() => import("../components/Page"), { ssr:false, });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider 
        theme={midnightTheme({
          accentColor: 'green',
          borderRadius: 'medium',
          fontStack: 'system'
        })} 
        chains={chains}>
          <ChakraProvider theme={theme}>
            <Page>
              <Component {...pageProps} />
            </Page>
          </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;






