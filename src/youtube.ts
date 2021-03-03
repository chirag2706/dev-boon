import Axios from 'axios';
const KEY = 'AIzaSyCBepiZ3VkGxuOLNHbdeGlzNUDc832rH5Q';

export default Axios.create({
    baseURL:'https://www.googleapis.com/youtube/v3',
    params:{
        part:'snippet',
        key:KEY,
        maxResults:10
    }
});