import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./axios";
import Cookies from 'js-cookie';
import { Cookie } from "@mui/icons-material";

axios.defaults.withCredentials = true;

export const userLogin = createAsyncThunk(
    'auth/login',
    async ({ username, password }, {rejectWithValue}) => {
        try {
            const response = await axios.post('/login', { username, password });
            if (response.data.result === 'success') {
                localStorage.setItem('userToken', response.data.id + '_' + username);
                return response.data.result;
            } else {
                return rejectWithValue("Incorrect username or password");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    },
);

export const userRegister = createAsyncThunk(
    'auth/register',
    async ({ username, email, birthday, phoneNumber, zipcode, password }, {rejectWithValue}) => {
        try {
            // const response = await fetch('https://jsonplaceholder.typicode.com/users');
            // const users = await response.json();
            // if (users.find(user => user.username === username)) {
            //     return rejectWithValue("The username is already used.");
            // }

            // localStorage.setItem('userToken', '100' + '_' + username + '_' + password);
            // localStorage.setItem('headline', "Hello");
            // localStorage.setItem('dummyUserInfo', JSON.stringify({
            //     'name': username,
            //     'username': username,
            //     'email': email,
            //     'phone': phoneNumber,
            //     'company': {'catchPhrase': 'hello'},
            //     'address': {'zipcode': zipcode,},
            // }));
            const response = await axios.post('/register', { 
                username, 
                email, 
                dob: new Date(birthday[0], birthday[1] - 1, birthday[2]), 
                phone: phoneNumber, 
                zipcode, 
                password
            });

            return response.data.result;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
);

export const userGetCredential = createAsyncThunk(
    'auth/getCredential',
    async ({ userToken }, {rejectWithValue}) => {
        try {
            const response = await axios.get('/info');
            if (response.status === 200) {
                return response.data;
            } else {
                return rejectWithValue("User does not exist");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    },
);

export const getPosts = createAsyncThunk(
    'auth/post',
    async ({ userToken, followings, skip }, {rejectWithValue}) => {
        if (!userToken) return rejectWithValue("Null Token");
        try {
            const [id, username] = userToken.split('_');
            const usersToQuery = [username, ...followings.map(following => following.username)];
            const response = await axios.post('/articlesByAuthors', { authors: usersToQuery, skip: skip, limit: 10 });

            if (response.status === 200) {
                return response.data.articles;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    },
);

export const getInitialPosts = createAsyncThunk(
    'auth/post/initial',
    async ({ userToken, followings }, {rejectWithValue}) => {
        if (!userToken) return rejectWithValue("Null Token");
        try {
            const [_, username] = userToken.split('_');
            const usersToQuery = [username, ...followings.map(following => following.username)];
            const response = await axios.post('/articlesByAuthors', { authors: usersToQuery, skip: 0, limit: 10 });
            if (response.status === 200) {
                return response.data.articles;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    },
);
        

export const addFollowing = createAsyncThunk(
    'auth/following',
    async ({ followingName }, {rejectWithValue}) => {
        try {
            // const res = await fetch("https://jsonplaceholder.typicode.com/users");
            // const users = await res.json();
            // const followingInfo = users.find(user => user.username === followingName);
            // if (followingInfo) {
            //     const followingPosts = await fetchPosts(followingInfo.id, followingName);
            //     return [followingInfo, followingPosts];
            // }

            const response = await axios.put('/following/' + followingName);
            if (response.status === 200) {
                return [{username: followingName, displayName: response.data.displayName, headline: response.data.headline}];
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    },
);

export const removeFollowing = createAsyncThunk(
    'auth/unfollowing',
    async({ followingName }, {rejectWithValue}) => {
        try {
            const response = await axios.delete('/following/' + followingName);
            if (response.status === 200) {
                const ret = []
                for (const [uname, dname, headline] of response.data.following) {
                    ret.push({username: uname, displayName: dname, headline: headline});
                }
                return ret;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message); 
            }
        }
    },
);

export const addPost = createAsyncThunk(
    'auth/post/addPost',
    async ({ text, image }, {rejectWithValue}) => {
        try {
            const response = await axios.post('/article', { text, image });
            const newPost = response.data.articles[response.data.articles.length - 1];
            return newPost;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
)

export const getFollowings = createAsyncThunk(
    'auth/followings/get',
    async ({ userToken }, {rejectWithValue}) => {
        try {
            // const response = await fetch('https://jsonplaceholder.typicode.com/users');
            // const users = await response.json();
            // const [id, u, p] = userToken.split('_');
            // if (id > 10)
            //     return [];
            
            // const uid = Number(id);
            // const userFollowings = [];
            // for (let i = 1; i <= 3; i++) {
            //     const following = users.filter(user => user.id == (uid + i) % 10);
            //     userFollowings.push(following[0]);
            // }

            // return userFollowings;
            const response = await axios.get('/following');
            if (response.status === 200) {
                const ret = []
                for (const [uname, dname] of response.data.following) {
                    const res = await axios.get('/headline/' + uname);
                    ret.push({username: uname, displayName: dname, headline: res.data.headline});
                }
                return ret;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
)

export const getHeadline = createAsyncThunk(
    'auth/headline/get',
    async () => {
        const response = await axios.get('headline');
        if (response.status === 200) {
            return response.data.headline;
        } else {
            return response.data.message;
        }
    },
)

export const putHeadline = createAsyncThunk(
    'auth/headline/put',
    async ({ headline }, {rejectWithValue}) => {
        try {
            const response = await axios.put('/headline', { headline });
            if (response.status === 200) {
                return response.data.headline;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
)

const fetchPosts = async (authorId, authorName) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const posts = await response.json();
    const userPosts = posts.filter(post => post.userId == authorId);
    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i]['author'] = authorName;
        userPosts[i]['textOnly'] = false;
        // const userRes = await fetch('https://jsonplaceholder.typicode.com/users')
        // const users = await userRes.json();
        // for (let j = 1; j <= 3; j++) {
        //     const following = users.filter(user => user.id == (authorId + j) % 10);
        //     const bodies = ['Nice!', 'Good!', 'Love it!'];
        //     userPosts[i]['comments'].push({'author': following[0].username, 'body': bodies[[Math.floor(Math.random() * bodies.length)]]});
        // }
    }
    
    return userPosts;
}