import React from 'react';
import { AppRegistry } from 'react-native';
import { StackNavigator } from 'react-navigation'
import Login from './app/components/Login'
import News from './app/components/News'

const Application = StackNavigator(
    {
        Home: { screen: News },
        News: { screen: News}
    }, {
        initialRouteName: 'Home',
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#273c75"
            },
            headerTintColor: "#f5f6fa"
        }
    }
);

export default class App extends React.Component {
    render() {
        return ( <Application /> )
    }
}

AppRegistry.registerComponent('AwesomeProject', () => Movies);
