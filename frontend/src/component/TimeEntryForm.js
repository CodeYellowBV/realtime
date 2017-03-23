import Form from './Form';
import FormField from './FormField';
import styled from 'styled-components';

export const TimeEntryForm = styled(Form)`
    display: flex;
    margin-bottom: .9em;
`;

export const TimeEntryFormField = styled(FormField)`
    flex: ${props => props.size || 0};
    margin-right: .9em;
`;
