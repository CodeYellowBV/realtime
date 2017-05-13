import { injectGlobal, css } from 'styled-components';
import 'react-select/dist/react-select.css';

export const COLOR_TINT = '#eecb3d';

const DESKTOP_QUERY = '(max-width: 768px)';

export function desktop(...args) {
    return css`
        @media ${DESKTOP_QUERY} {
            ${css(...args)}
        }
    `;
}

export default injectGlobal`
    html {
        box-sizing: border-box;
    }
    *, *:before, *:after {
        box-sizing: inherit;
    }
    body {
        background: #222;
        color: #fff;
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
    html, body, #root {
        width: 100%;
        height: 100%;
    }
`;
