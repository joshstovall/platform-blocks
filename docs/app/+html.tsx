import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Primary Meta Tags */}
        <meta name="title" content="Platform Blocks - Documentation" />
        <meta name="description" content="A modern React Native component library with theme support and consistent design tokens. Learn how to build beautiful, accessible interfaces for iOS, Android, and Web." />
        <meta name="keywords" content="React Native, UI Library, Components, Design System, TypeScript, Mobile, Web, Cross-platform" />
        <meta name="author" content="Platform Blocks Team" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://platform-blocks.com/" />
        <meta property="og:title" content="Platform Blocks - Documentation" />
        <meta property="og:description" content="A modern React Native component library with theme support and consistent design tokens." />
        <meta property="og:image" content="https://platform-blocks.com/og-image.jpg" />
        <meta property="og:site_name" content="Platform Blocks" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://platform-blocks.com/" />
        <meta property="twitter:title" content="Platform Blocks - Documentation" />
        <meta property="twitter:description" content="A modern React Native component library with theme support and consistent design tokens." />
        <meta property="twitter:image" content="https://platform-blocks.com/og-image.jpg" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Fonts - preconnect for performance */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://platform-blocks.com/" />
        
        {/* Prevents zooming issues on iOS */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

        {/* Ensures proper encoding */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles to improve the initial loading page */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        
        {/* Prevent flash of unstyled content by setting initial theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}

#root {
  display: flex;
  flex: 1;
  height: 100vh;
  width: 100vw;
}
`;

const themeScript = `
(function() {
  try {
    const saved = localStorage.getItem('platform-blocks-theme-mode');
    let scheme = 'light';
    
    if (saved === 'dark') {
      scheme = 'dark';
    } else if (saved === 'light') {
      scheme = 'light';
    } else {
      scheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    document.documentElement.style.colorScheme = scheme;
    document.documentElement.setAttribute('data-theme', scheme);
    
    if (scheme === 'dark') {
      document.documentElement.style.backgroundColor = '#000000';
      document.body.style.backgroundColor = '#000000';
    } else {
      document.documentElement.style.backgroundColor = '#ffffff';
      document.body.style.backgroundColor = '#ffffff';
    }
  } catch (e) {
    document.documentElement.style.colorScheme = 'light';
  }
})();
`;
