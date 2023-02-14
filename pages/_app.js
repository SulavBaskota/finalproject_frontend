import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import { MoralisProvider } from "react-moralis";
import Layout from "../components/Layout";
import { useState, useCallback, useMemo } from "react";
import { RoleContext } from "../src/Contexts";
import { register } from "swiper/element/bundle";
import "../styles/globals.css";

// Client-side cache, shared for the whole session of the user in the browser.

// register Swiper custom elements
register();

const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [role, setRole] = useState(null);

  const updateRole = useCallback((res) => {
    setRole(res);
  }, []);

  const roleContextValue = useMemo(
    () => ({
      role,
      updateRole,
    }),
    [role, updateRole]
  );

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <MoralisProvider initializeOnMount={false}>
          <RoleContext.Provider value={roleContextValue}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RoleContext.Provider>
        </MoralisProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
