import { injectGlobal, css } from 'styled-components';

export const DEFAULT_FONT = css`
    font-family: -apple-system, system-ui, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
`;

export default injectGlobal`
    html {
      box-sizing: border-box;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
        background: #ccc;
        ${DEFAULT_FONT};
    }
`;
