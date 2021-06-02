import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { css, Global } from '@emotion/react';
import { config, dom } from '@fortawesome/fontawesome-svg-core';
import { createUploadLink } from 'apollo-upload-client';
import { Dialoog, DialoogProvider } from 'dialoog';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { createElement } from 'react';

import { Sidebar } from '../components/templates/Sidebar';
import { AuthProvider } from '../states/authentication';
import { generatePalette } from '../utils/generatePalette';

function customFetch(url: RequestInfo, opts: any = {}) {
  return new Promise<any>((resolve, reject) => {
    if (typeof url !== 'string') {
      return reject();
    }
    const xhr = new XMLHttpRequest()

    xhr.open(opts.method || 'get', url)

    // tslint:disable-next-line:forin
    for (const k in opts.headers || {}) {
      xhr.setRequestHeader(k, opts.headers[k]);
    }

    xhr.onload = (e: any) =>
      resolve({
        ok: true,
        text: () => Promise.resolve(e.target.responseText),
        json: () => Promise.resolve(JSON.parse(e.target.responseText))
      })

    xhr.onerror = reject

    if (xhr.upload) {
      xhr.upload.onprogress = opts.onProgress;
    }

    xhr.send(opts.body)
  })
}

const client = new ApolloClient({
  link: setContext((_, { headers }) => {
    const token = localStorage.getItem('token');

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  }).concat(createUploadLink({
    uri: '/api',
    fetch: typeof window === 'undefined' ? fetch : customFetch
  })),
  cache: new InMemoryCache()
});

config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  const template = (Component as any).template ?? Sidebar;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap"/>
        <title>Moneo</title>
      </Head>
      <Global
        styles={css`
          ${dom.css()};

          :root {
            ${generatePalette(0)};

            @media (prefers-color-scheme: dark) {
              ${generatePalette(1)};
            }
          }

          *, *::before, *::after {
            box-sizing: border-box;
          }

          html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym,
          address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var,
          b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead,
          tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav,
          output, ruby, section, summary, time, mark, audio, video {
            margin: 0;
            padding: 0;
            border: 0;
            font: inherit;
            vertical-align: baseline;
          }

          article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {
            display: block;
          }

          body {
            color: var(--gray-500);
            background-color: var(--gray-0);
            font-family: "Open Sans", sans-serif;
            overflow-x: hidden;
            overflow-y: scroll;
            line-height: 1.25;
          }

          ol, ul {
            list-style: none;
          }

          blockquote, q {
            quotes: none;
          }

          blockquote::before, blockquote::after, q::before, q::after {
            content: none;
          }

          table {
            border-collapse: collapse;
            border-spacing: 0;
          }

          select, button, input {
            margin: 0;
            padding: 0;
            border: 0;
            color: inherit;
            background: none;
            font: inherit;
            appearance: none;
          }

          button:not(:disabled):hover {
            cursor: pointer;
          }

          svg, img {
            vertical-align: middle;
          }
        `}
      />
      <ApolloProvider client={client}>
        <AuthProvider>
          <DialoogProvider>
            {createElement(template, {}, (
              <Component {...pageProps}/>
            ))}
            <Dialoog/>
          </DialoogProvider>
        </AuthProvider>
      </ApolloProvider>
    </>
  );
}
