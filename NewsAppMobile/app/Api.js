const api = "http://10.26.111.106:8080/api/";
// const api = "http://192.168.0.49:8080/api/";

export default {
    NEWS: api + "news",
    LOGIN: api + "user/login",
    REGISTER: api + "user/register",
    USER_INFO: api + "user/me",
    ARTICLE: api + "article/",
    CREATE_ARTICLE: api + "article/create"
}