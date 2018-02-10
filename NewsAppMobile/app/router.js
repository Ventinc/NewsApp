import { StackNavigator, TabNavigator } from 'react-navigation';
import Entypo from 'react-native-vector-icons/Entypo'

import News from './components/News';
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Profile from './components/Profile';
import EditArticle from "./components/EditArticle";
import ViewArticle from "./components/ViewArticle";

export const ArticleNav = StackNavigator(
    {
        News: {
            screen: News,
            navigationOptions: {
                header: null
            }
        },
        NewArticle: {
            screen: EditArticle,
            navigationOptions: {
                title: "Nouvel article",
            },
        },
        ViewArticle: {
            screen: ViewArticle,
        }
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: "#273c75"
            },
            headerTintColor: "#f5f6fa"
        },
    }
);

export const SignedIn = TabNavigator(
    {
        News: {
            screen: ArticleNav,
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
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: "#273c75"
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