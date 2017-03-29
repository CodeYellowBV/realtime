import React from 'react';
import styled from 'styled-components';

export const EntryList = styled.div`
    width: 100%;
    border-top: 1px solid #ccc;
`;

export const EntryItem = styled.div`
    display: flex;
    width: 100%;
    flex-flow: row wrap;
    border-bottom: 1px solid #ccc;
    padding: .5em 0;
`;

export const EntryItemDescription = styled.div`
    font-weight: bold;
    flex: 3;
`;

export const EntryItemProject = styled.div`
    flex: 1;
`;

export const EntryItemHours = styled.div`
    flex: 2;
`;

export const EntryItemActions = styled.div`
    align-self: flex-end;
`;
