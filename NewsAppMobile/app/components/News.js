import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    Button,
    ToastAndroid,
    FlatList, TouchableNativeFeedback, Alert, Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Api from '../Api'


class Article extends React.Component {

    render() {
        return (
            <TouchableNativeFeedback
                onPress={() => Alert.alert("Go view " + this.props.title)}
                background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
                <View style={styles.article}>
                    <Text style={styles.articleTitle}>{this.props.title}</Text>
                    <Text numberOfLines={2}>{this.props.content}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

export default class News extends React.Component {
    static navigationOptions = {
        title: "News",
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        return fetch(Api.NEWS)
            .then((res) => {
                const statusCode = res.status;
                const data = res.json();
                return Promise.all([statusCode, data]);
            })
            .then(([res, data]) => {
                if (data.success === true) {
                    this.setState({
                        isLoading: false,
                        news: data.data
                    }, function () {

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
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#487eb0" />
                </View>
            );
        }

        return (
            <ScrollView style={styles.container}>
                <FlatList
                    data={this.state.news}
                    renderItem={
                        ({item}) => <Article title={item.title} content={item.content} id={item.id} />
                    }
                    keyExtractor={(item, index) => index}
                />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa'
    },
    center: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    article: {
        backgroundColor: '#f5f6fa',
        padding:10,
        borderBottomWidth: 1,
        borderBottomColor: '#7f8fa6'
    },
    articleTitle: {
        color: '#9c88ff',
        fontWeight: 'bold',
        fontSize: 24,
    }
});