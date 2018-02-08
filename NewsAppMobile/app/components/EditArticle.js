import React from 'react'
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    ToastAndroid,
    AsyncStorage,
    Platform
} from 'react-native'
import Api from '../Api'
import {USER_KEY} from "../auth";

export default class EditArticle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            content: ""
        }
    }

    create = () => {
        const {navigation} = this.props;

        AsyncStorage.getItem(USER_KEY).then(token => {
            fetch(Api.CREATE_ARTICLE, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: this.state.title,
                    content: this.state.content
                })
            })
                .then((res) => {
                    const statusCode = res.status;
                    const data = res.json();
                    return Promise.all([statusCode, data]);
                })
                .then(([res, data]) => {
                    if (data.success === true) {
                        if (Platform.OS === 'android')
                            ToastAndroid.show(data.message, ToastAndroid.LONG);
                        navigation.goBack();
                    } else {
                        Alert.alert(data.message);
                    }
                }).catch(err => Alert.alert(err));
        }).done();
    };

    render() {
        return (
            <KeyboardAvoidingView behavior="height" style={styles.wrapper}>
                <View>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input}
                               onChangeText={(title) => this.setState({title})}
                               value={this.state.title}
                               placeholder="Title"
                               maxLength={50}
                               underlineColorAndroid="transparent"/>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input}
                               onChangeText={(content) => this.setState({content})}
                               value={this.state.content}
                               placeholder="Description"
                               multiline={true}
                               numberOfLines={4}
                               underlineColorAndroid="transparent"/>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={this.create}>
                        <Text style={styles.textWhite}>Ajouter</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    input: {
        padding: 10,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: "#273c75",
        margin: 5
    },
    btn: {
        alignSelf: 'stretch',
        backgroundColor: '#9c88ff',
        padding: 20,
        alignItems: 'center',
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#273c75',
        padding: 12
    }
})