const getAllPosts = () => (dispatch) => {

    try{
        const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`)
        dispatch({type: GET_ALL_POSTS_SUCCESS, payload: data})
    }catch(error){
        dispatch({type: GET_ALL_POSTS_FAILURE, payload: error.response.data.message})
    }
}