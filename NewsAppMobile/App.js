import React from 'react';
import {Alert, TouchableNativeFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { TabNavigator, TabBarBottom } from 'react-navigation'
import Login from './app/components/Login'
import News from './app/components/News'

const Application = TabNavigator(
    {
        Home: { screen: News },
        Login: { screen: Login }
    }, {
        initialRouteName: 'Home',
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `ios-home${focused ? '' : '-outline'}`;
                } else if (routeName === 'Login') {
                    iconName = `ios-options${focused ? '' : '-outline'}`;
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Icon name={iconName} size={25} color={tintColor} />;
            },
        }),
        tabBarComponent: TabBarBottom,
        tabBarPosition: 'top',
        tabBarOptions: {
            activeTintColor: '#273c75',
            inactiveTintColor: 'gray',
        },
    }
);

export default class App extends React.Component {
    render() {
        return ( <Application /> )
    }
}