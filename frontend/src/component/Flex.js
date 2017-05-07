import styled from 'styled-components';

const Flex = styled.div`
    display: flex;
    ${props => (props.direction ? `flex-direction:${props.direction};` : '')}
`;

export default Flex;
