import Form from './Form';
import FormField from './FormField';
import styled from 'styled-components';

export const TimeEntryForm = styled(Form)`
    display: flex;
    margin-bottom: 40px;
    align-items: flex-end;
`;

export const TimeEntryFormField = styled(FormField)`
    flex: ${props => props.size || 0};
    margin: 0 8px;
`;
