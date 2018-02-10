import React from 'react'
import {
    AsyncStorage,
    Platform,
    StyleSheet,
    Text,
    ToastAndroid,
    ScrollView,
    View,
    ActivityIndicator,
} from 'react-native'
import Api from "../Api";
import {USER_KEY} from "../auth";

export default class ViewArticle extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { state: { params = {} } } = navigation;
        return {
            title: params.title || "default title",
        };
    };


    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
        }
    }

    fetchData() {
        const {navigation} = this.props;
        return AsyncStorage.getItem(USER_KEY).then(token => {
            return fetch(Api.ARTICLE + this.props.id, {
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
                            article: data.data
                        });
                    } else {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(data.message, ToastAndroid.LONG);
                            navigation.goBack();
                        }
                    }
                })
                .catch((e) => {
                    if (Platform.OS === 'android')
                        ToastAndroid.show(e.message, ToastAndroid.SHORT);
                });
        }).done()
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        this.props = params;
        return this.fetchData();
    }

    render() {
        const {navigation} = this.props;

        if (this.state.isLoading) {
            return (
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#487eb0"/>
                </View>
            );
        }

        const {article} = this.state;

        return (
            <ScrollView style={styles.wrapper}>
                <View style={styles.article}>
                    <Text style={styles.text}>{article.content}</Text>
                    <Text style={styles.author}>By {article.author}</Text>
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    text: {
        fontSize: 24
    },
    author: {
        color: "#9c88ff"
    },
    article: {
        margin: 10
    }
})