import React from 'react';
import {Alert, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
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
            headerTintColor: "#f5f6fa",
            headerRight: (
                <TouchableNativeFeedback onPress={() => Alert.alert('GO CONNECT')}>
                    <Icon name="login-variant" size={24} color="#f5f6fa" style={{marginRight:10}}/>
                </TouchableNativeFeedback>
            )
        }
    }
);

export default class App extends React.Component {
    render() {
        return ( <Application /> )
    }
}