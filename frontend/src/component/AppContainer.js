import styled from 'styled-components';

const AppContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;

    ${({invertColors}) => invertColors ? `
        filter: invert();
    ` : null}
`;

export default AppContainer;
