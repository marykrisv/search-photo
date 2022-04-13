import axios from 'axios'

const CLIENT_ID = 'nqr97j7j7DHt-U8wbmMZKqdsSk5RihbNn_BBixc7F00'
const URL = 'https://api.unsplash.com/'

const getUrlLink = (link) => {
    return URL + link + '&client_id=' + CLIENT_ID
}

const searchPhoto = async (query, currentPage, perPage) => {
    return await axios.get(getUrlLink('search/photos?query=' + query + '&page=' + currentPage + '&per_page=' + perPage))
}

export const photoService = {
    searchPhoto,
}