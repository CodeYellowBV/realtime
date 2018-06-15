import { injectGlobal, css } from 'styled-components';
import 'react-select/dist/react-select.css';

//import isStaging from 'container/AppHeader';

export const COLOR_TINT = '#eecb3d';

const MOBILE_QUERY = '(max-width: 768px)';

export function isStaging(){
    return window.location.href.includes('realtime.test') || window.location.href.includes('staging');
}

function getTextColor(){
    if(isStaging())
        return '#f22';
    return '#fff';
}

export function mobile(...args) {
    return css`
        @media ${MOBILE_QUERY} {
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
        color: ${getTextColor()};
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
