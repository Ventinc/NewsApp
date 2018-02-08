import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    FlatList,
    TouchableNativeFeedback,
    Alert,
    Platform,
    RefreshControl,
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
                    <View style={styles.articleHeader}>
                        <Text style={styles.articleTitle}>{this.props.title}</Text>
                        <Text style={styles.articleAuthor}>By {this.props.author}</Text>
                    </View>
                    <Text numberOfLines={2}>{this.props.content}</Text>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

export default class News extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false
        };
    }

    fetchData() {
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

    _onRefresh(){
        this.setState({refreshing: true});
        this.fetchData().then(() => {
            this.setState({refreshing: false})
        })
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
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color="#487eb0"/>
                </View>
            );
        }

        return (
            <ScrollView style={styles.container}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh.bind(this)}/>
                        }>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('NewArticle')}>
                    <Text style={styles.btnText}>Nouvel Article</Text>
                </TouchableOpacity>
                <FlatList
                    data={this.state.news}
                    renderItem={
                        ({item}) => <Article title={item.title} content={item.content} id={item.id} author={item.author} />
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
    articleHeader: {
        flex: 1,
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    articleTitle: {
        color: '#9c88ff',
        fontWeight: 'bold',
        fontSize: 24,
        alignSelf: 'center'
    },
    articleAuthor: {
        color: "#7f8fa6",
        fontSize: 12,
        alignSelf: 'center',
        marginLeft: 10
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
    }
});