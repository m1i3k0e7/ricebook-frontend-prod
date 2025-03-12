import { createSlice } from "@reduxjs/toolkit";
import { addFollowing, addPost, getFollowings, getHeadline, getInitialPosts, getPosts, removeFollowing, userGetCredential, userLogin, userRegister } from "./authAction";
import Cookies from 'js-cookie';

const userToken = Cookies.get('userToken') || localStorage.getItem('userToken') || null;

const initialState = {
    loading: false,
    userInfo: null,
    userToken,
    error: null,
    success: false,
    posts: [],
    showedPosts: [],
    loadingPosts: false,
    followings: [],
    addingFollowing: false,
    removingFollowing: false,
    loadingCred: false,
    username: "",
    addingPost: false,
    headline: "",
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userToken')
            Cookies.remove('userToken');
            state.loading = false;
            state.userInfo = null;
            state.userToken = null;
            state.error = null;
        },
        searchPosts: (state, action) => {
            if (action.payload.searchVal === '') {
                state.showedPosts = state.posts;
            } else {
                const plainPosts = JSON.parse(JSON.stringify(state.posts));
                state.showedPosts = plainPosts.filter(post => post.text.includes(action.payload.searchVal) || post.authorDisplayName.includes(action.payload.searchVal));
            }
        },
        setCredential: (state, { payload }) => {
            state.userInfo = payload;
        },
        getUserToken: (state) => {
            state.userToken = Cookies.get('userToken') || localStorage.getItem('userToken') || null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(userLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userLogin.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.userToken = Cookies.get('userToken') || localStorage.getItem('userToken') || null;
        })
        .addCase(userLogin.rejected, (state, { payload }) => {
            state.error = payload;
            state.loading = false;
            state.userToken = Cookies.get('userToken') || localStorage.getItem('userToken') || null;
        }).addCase(userRegister.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(userRegister.fulfilled, (state) => {
            state.loading = false;
            state.userToken = Cookies.get('userToken') || localStorage.getItem('userToken') || null;
        }).addCase(userRegister.rejected, (state, {payload}) => {
            state.error = payload;
            state.loading = false;
            state.userToken = Cookies.get('userToken') || localStorage.getItem('userToken') || null;
        }).addCase(getPosts.pending, (state) => {
            state.loadingPosts = true;
        }).addCase(getPosts.fulfilled, (state, {payload}) => {
            state.posts = state.posts.concat(payload);
            state.showedPosts = state.posts;
            state.loadingPosts = false;
        }).addCase(getPosts.rejected, (state) => {
            state.posts = [];
            state.showedPosts = [];
            state.loadingPosts = false;
        }).addCase(getInitialPosts.pending, (state) => {
            state.loadingPosts = true;
        }).addCase(getInitialPosts.fulfilled, (state, {payload}) => {
            state.posts = payload;
            state.showedPosts = state.posts;
            state.loadingPosts = false;
        }).addCase(getInitialPosts.rejected, (state) => {
            state.posts = [];
            state.showedPosts = [];
            state.loadingPosts = false;
        }).addCase(addFollowing.pending, (state) => {
            state.addingFollowing = true;
        }).addCase(addFollowing.fulfilled, (state, {payload}) => {
            state.addingFollowing = false;
            state.followings.push(payload[0]);
        }).addCase(addFollowing.rejected, (state) => {
            state.addingFollowing = false;
        }).addCase(removeFollowing.pending, (state) => {
            state.removingFollowing = true;
        }).addCase(removeFollowing.fulfilled, (state, { payload }) => {
            state.followings = payload;
            state.removingFollowing = false;
        }).addCase(removeFollowing.rejected, (state) => {
            state.removingFollowing = false;
        }).addCase(userGetCredential.pending, (state) => {
            state.loadingCred = true;
        }).addCase(userGetCredential.fulfilled, (state, { payload }) => {
            state.loadingCred = false;
            state.username = payload.username;
        }).addCase(userGetCredential.rejected, (state) => {
            state.loadingCred = false;
        }).addCase(addPost.pending, (state) => {
            state.addingPost = true;
        }).addCase(addPost.fulfilled, (state, { payload }) => {
            state.addingPost = false;
            state.posts.unshift(payload);
            state.showedPosts = state.posts;
        }).addCase(addPost.rejected, (state) => {
            state.addingPost = false;
        }).addCase(getFollowings.fulfilled, (state, { payload }) => {
            state.followings = payload;
        }).addCase(getHeadline.fulfilled, (state, { payload }) => {
            state.headline = payload;
        })
    },
});

export const { logout, searchPosts } = authSlice.actions
export default authSlice.reducer