import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    Button,
    FlatList, TouchableNativeFeedback, Alert, Platform
} from 'react-native'
import {StackNavigator} from 'react-navigation'
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
        headerRight: (
            <Button
                onPress={() => Alert.alert("This is button")}
                title="Connect"
                color="#f5f6fa"/>
        )
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        return fetch(Api.NEWS)
            .then((res) => res.json())
            .then((resJson) => {
                this.setState({
                    isLoading: false,
                    news: resJson
                }, function () {
                    
                });
            })
            .catch(e => console.error(e));
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
        backgroundColor: 'red',
        padding:10
    },
    articleTitle: {
        fontWeight: 'bold',
        fontSize: 24,
    }
});