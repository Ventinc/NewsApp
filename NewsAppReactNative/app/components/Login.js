import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from 'react-native'
import { StackNavigator } from 'react-navigation'

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    async _loadInitialState() {
        let value = await AsyncStorage.getItem('user');
        if (value !== null) {
            this.props.navigation.navigate('News');
        }
    }

    login = () => {
        fetch('http://192.168.0.49:3000/users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        })
            .then((res) => res.json())
            .then((res) => {
                if (res.success === true) {
                    AsyncStorage.setItem('user', res.user);
                    this.props.navigation.navigate('News');
                } else {
                    alert(res.message)
                }
            })
            .done()
    }

    render() {
        return (
            <KeyboardAvoidingView behavior='padding' style={styles.wrapper}>
                <View style={styles.container}>
                    <Text style={styles.header}>Connexion</Text>
                    <TextInput style={styles.textInput}
                               placeholder='Pseudo'
                               onChangeText={(username) => this.setState({username})}
                               underlineColorAndroid='transparent'/>

                    <TextInput style={styles.textInput}
                               placeholder='Mot de passe'
                               onChangeText={(password) => this.setState({password})}
                               underlineColorAndroid='transparent'
                               secureTextEntry={true}/>

                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.login}>
                        <Text style={styles.textWhite}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#273c75',
        paddingLeft:40,
        paddingRight:40
    },
    header: {
        fontSize: 24,
        marginBottom: 60,
        color: '#f5f6fa',
        fontWeight: 'bold'
    },
    textInput: {
        alignSelf: 'stretch',
        padding: 16,
        marginBottom: 20,
        backgroundColor: '#f5f6fa'
    },
    btn: {
        alignSelf: 'stretch',
        backgroundColor: '#4cd137',
        padding: 20,
        alignItems: 'center',
    },
    textWhite: {
        color: '#f5f6fa'
    }
});