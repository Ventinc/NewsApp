import { AsyncStorage } from 'react-native'

export const USER_KEY = "user_token";

export const onSignIn = (value) => AsyncStorage.setItem(USER_KEY, value);

export const onSignOut = () => AsyncStorage.removeItem(USER_KEY);

export const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USER_KEY)
            .then(res => {
                resolve(res !== null);
            })
            .catch(err => reject(err))
    })
};

