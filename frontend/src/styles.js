import { injectGlobal } from 'styled-components';

export const COLOR_TINT = '#eecb3d';

export default injectGlobal`
    html {
      box-sizing: border-box;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
        background: #333;
        color: white;
        font-family: -apple-system, system-ui, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    textarea,
    input,
    button {
        outline: none;
        font-family: inherit;
    }
`;
