import { StackNavigator, TabNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'

import News from './components/News';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from './components/Profile';

export const SignedIn = TabNavigator(
    {
        News: {
            screen: News,
            navigationOptions: {
                tabBarLabel: 'News',
                tabBarIcon: ({tintColor}) => (
                    <Entypo name="news" size={30} color={tintColor}/>
                )
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({tintColor}) => (
                    <Entypo name="user" size={30} color={tintColor}/>
                )
            }
        }
    }
);

export const SignedOut = StackNavigator(
    {
        SignIn: {
            screen: SignIn,
            navigationOptions: {
                title: "Se connecter",
            }
        },
        SignUp: {
            screen: SignUp,
            navigationOptions: {
                title: "S'inscrire",
            }
        }
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#273c75"
            },
            headerTintColor: "#f5f6fa"
        }

    }
);

export const rootNavigator = (signedIn = false) => {
    return StackNavigator(
        {
            SignedIn: {
                screen: SignedIn,
                navigationOptions: {
                    gesturesEnabled: false
            }
            },
            SignedOut: {
                screen: SignedOut,
                navigationOptions: {
                    gesturesEnabled: false
                }
            },
        },
        {
            headerMode: "none",
            mode: "modal",
            initialRouteName: signedIn ? "SignedIn" : "SignedOut"
        }
    );
}