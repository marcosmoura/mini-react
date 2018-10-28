import MiniReact from '../dist/mini-react.umd'
import { injectGlobal } from 'emotion'

import App from './App'

const root = document.getElementById('root')

MiniReact.render(new App(), root)

injectGlobal`
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  html {
    box-sizing: border-box;
  }

  body {
    height: 100vh;
    margin: 0;
    position: relative;
    background-color: #fff;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  [tabindex="-1"]:focus {
    outline: none !important;
  };
`
