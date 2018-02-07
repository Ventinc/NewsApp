import React from 'react';
import {Button} from 'react-native';
import {onSignOut} from "../auth";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {navigation} = this.props;

        return (
            <Button
                backgroundColor="#03A9F4"
                title="Se déconnecter"
                onPress={() => onSignOut().then(() => navigation.navigate("SignedOut"))}
            />
        )
    }
}