import React from 'react';
import { Alert } from 'react-native';
import { rootNavigator } from './app/router';
import { isSignedIn } from "./app/auth";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            signedIn: false,
            checkedSignIn: false
        };
    }

    componentWillMount() {
        isSignedIn()
            .then( res => this.setState({signedIn: res, checkedSignIn: true}) )
            .catch(err => Alert.alert("An error occured !"));
    }

    render() {
        const { checkedSignIn, signedIn } = this.state;

        if (!checkedSignIn) {
            return null;
        }

        const Layout = rootNavigator(signedIn);
        return ( <Layout /> )
    }
}