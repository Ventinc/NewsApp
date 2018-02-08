import React from 'react';
import {
    View, StyleSheet, TouchableOpacity, Text, Image,
    Platform, ToastAndroid, AsyncStorage, ActivityIndicator
} from 'react-native';
import {onSignOut, USER_KEY} from "../auth";
import Api from "../Api";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        };
    }

    fetchData() {
        return AsyncStorage.getItem(USER_KEY).then(token => {
            return fetch(Api.USER_INFO, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
                .then((res) => {
                    const statusCode = res.status;
                    const data = res.json();
                    return Promise.all([statusCode, data]);
                })
                .then(([res, data]) => {
                    if (data.success === true) {
                        this.setState({
                            isLoading: false,
                            username: data.username
                        });
                    } else {
                        if (Platform.OS === 'android')
                            ToastAndroid.show(data.message, ToastAndroid.LONG);
                    }
                })
                .catch((e) => {
                    if (Platform.OS === 'android')
                        ToastAndroid.show(e.message, ToastAndroid.SHORT);
                });
        }).done()
    }

    componentWillMount() {
        return this.fetchData()
    }

    componentWillUpdate() {
        return this.fetchData()
    }

    render() {
        const {navigation} = this.props;

        if (this.state.isLoading) {
            return (
                <View style={[styles.wrapper, styles.center]}>
                    <ActivityIndicator size="large" color="#487eb0"/>
                </View>
            )
        }

        return (
            <View style={[styles.wrapper, styles.center]}>
                <Image
                    style={styles.avatar}
                    source={{uri: "http://lorempicsum.com/up/200/200/6"}}
                />
                <Text style={styles.username}>TOTO</Text>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => onSignOut().then(() => navigation.navigate("SignedOut"))}
                >
                    <Text style={styles.btnText}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f5f6fa'
    },
    center: {
        flex:1,
        justifyContent: 'center',
    },
    avatar: {
        marginBottom: 5,
        alignSelf: 'center',
        width: 100,
        height: 100,
        borderRadius: 10
    },
    btn: {
        alignItems: 'center',
        padding: 15,
        margin: 4,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#273c75"
    },
    btnText: {
        color: "#273c75",
        fontSize: 16,
    },
    username: {
        alignSelf: 'center',
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold',
        color: "#40739e"
    }
})