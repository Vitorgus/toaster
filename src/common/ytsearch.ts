import axios from 'axios';
import qs from "querystring";

export default async tags => {
    const params = {
        part: 'id',
        maxResults: 1,
        q: tags,
        type: 'video',
        key: process.env.TOKEN_YOUTUBE_API,
        fields: 'items(id(videoId))'
    };

    const query = 'https://youtube.googleapis.com/youtube/v3/search?' + qs.stringify(params);

    const answer = await axios.get(query);
    const search = answer.data.items;
    
    return search.length ? search[0].id.videoId : null;
};
