import styled from 'styled-components';
import { mobile } from '../styles';

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    ${({ invertColors }) => (invertColors ? `
        filter: invert();
    ` : null)}

    ${mobile`
        height: auto;
    `}
`;

export default AppContainer;
