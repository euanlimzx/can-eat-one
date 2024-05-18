import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ChakraProvider>
    <main className={GeistSans.className}>
      <Component {...pageProps} />
    </main>
    </ChakraProvider>
  );
};

export default api.withTRPC(MyApp);
