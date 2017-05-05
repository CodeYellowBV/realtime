import styled from 'styled-components';

export default styled.button`
    height: 48px;
    width: 48px;
    background: url(${props => props.icon});
    border: 0;
    cursor: pointer;
`;
