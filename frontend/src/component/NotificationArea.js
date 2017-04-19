import { NotificationStack } from 'react-notification';
import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';

@observer
export default class NotificationArea extends React.Component {
    static propTypes = {
        store: PropTypes.object,
    };
    dismiss = notification => {
        this.props.store.notifications.remove(notification);
    };
    render() {
        return (
            <NotificationStack
                notifications={this.props.store.notifications.slice()}
                onDismiss={this.dismiss}
            />
        );
    }
}
