import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Alert
} from 'react-native'
import Api from '../Api'
import {onSignIn} from "../auth";

export default class SignIn extends React.Component {
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
        let value = await AsyncStorage.getItem('user_token');
        if (value !== null) {
            this.props.navigation.navigate('SignedIn');
        }
    }

    login = () => {
        const {navigation} = this.props;

        fetch(Api.LOGIN, {
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
            .then((res) => {
                const statusCode = res.status;
                const data = res.json();
                return Promise.all([statusCode, data]);
            })
            .then(([res, data]) => {
                if (data.success === true) {
                    onSignIn(data.token).then(() => navigation.navigate("SignedIn"));
                } else {
                    Alert.alert(data.message)
                }
            })
            .done()
    }

    render() {
        const { navigation } = this.props;

        return (
            <View behavior='padding' style={styles.wrapper}>
                <View style={styles.container}>
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
                    <TouchableOpacity
                        style={styles.link}
                        onPress={() => navigation.navigate("SignUp")}>
                        <Text style={styles.textBlue}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        borderRadius: 5
    },
    textWhite: {
        color: '#f5f6fa'
    },
    link: {
        padding: 10,
    },
    textBlue: {
        color: '#00a8ff'
    }
});