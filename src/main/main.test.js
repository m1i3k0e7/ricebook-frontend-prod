import authReducer from '../auth/authSlice';
import { userLogin, getPosts, addFollowing, removeFollowing, getFollowings } from '../auth/authAction';
import { configureStore } from '@reduxjs/toolkit';
import { searchPosts } from '../auth/authSlice';

test('should fetch all articles for current logged in user', async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({username: 'Bret', password: 'Kulas Light'})
    );

    const action2 = await store.dispatch(
        getPosts({userToken: store.getState().auth.userToken})
    );

    const [id, username, password] = store.getState().auth.userToken.split('_');
    const uid = Number(id);
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    const authorIds = [1, 2, 3, 4];
    const userPosts = posts.filter(post => authorIds.includes(post.userId));
    const userRes = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await userRes.json();
    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i]['author'] = users.find(user => user.id === Math.floor(i / 10) + 1).username;
        userPosts[i]['textOnly'] = false;
    }

    expect(store.getState().auth.posts.length).toBe(userPosts.length);
    expect(store.getState().auth.posts).toEqual(userPosts);

    const action3 = await store.dispatch(
        getFollowings({userToken: store.getState().auth.userToken})
    );
    const followings = users.filter(user => user.id === 2 || user.id === 3 || user.id === 4);
    expect(store.getState().auth.followings).toEqual(followings);
});

test('should fetch subset of articles for current logged in user given search keyword', async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({username: 'Bret', password: 'Kulas Light'})
    );

    const action2 = await store.dispatch(
        getPosts({userToken: store.getState().auth.userToken})
    );

    const action3 = store.dispatch(
        searchPosts({searchVal: "sunt"})
    );

    const [id, username, password] = store.getState().auth.userToken.split('_');
    const uid = Number(id);
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    const authorIds = [1, 2, 3, 4];
    const userPosts = posts.filter(post => authorIds.includes(post.userId));
    const userRes = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await userRes.json();
    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i]['author'] = users.find(user => user.id === userPosts[i].userId).username;
        userPosts[i]['textOnly'] = false;
    }

    const searchedPosts = userPosts.filter(post => post.body.includes('sunt'));
    expect(store.getState().auth.showedPosts.length).toBe(searchedPosts.length);
    expect(store.getState().auth.showedPosts).toEqual(searchedPosts);

    const action4 = store.dispatch(
        searchPosts({searchVal: "Bret"})
    );

    const searchedPosts2 = userPosts.filter(post => post['author'].includes('Bret'));
    expect(store.getState().auth.showedPosts.length).toBe(searchedPosts2.length);
    expect(store.getState().auth.showedPosts).toEqual(searchedPosts2);
});

test('shuold add articles when adding a follower', async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({username: 'Bret', password: 'Kulas Light'})
    );

    const action2 = await store.dispatch(
        getPosts({userToken: store.getState().auth.userToken})
    );

    const action3 = await store.dispatch(
        addFollowing({followingName: "Kamren"}),
    )

    const [id, username, password] = store.getState().auth.userToken.split('_');
    const uid = Number(id);
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    const userRes = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await userRes.json();
    for (let i = 0; i < posts.length; i++) {
        posts[i]['author'] = users.find(user => user.id === posts[i].userId).username;
        posts[i]['textOnly'] = false;
    }

    const authorIds = [1, 2, 3, 4];
    const userPosts = posts.filter(post => authorIds.includes(post.userId));
    const newFollowingPosts = posts.filter(post => post.userId === 5);
    const newUserPosts = newFollowingPosts.concat(userPosts);

    expect(store.getState().auth.posts.length).toBe(newUserPosts.length);
    expect(store.getState().auth.posts).toEqual(newUserPosts);
});

test('should remove articles when removing a follower', async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({username: 'Bret', password: 'Kulas Light'})
    );

    const action2 = await store.dispatch(
        getPosts({userToken: store.getState().auth.userToken})
    );

    const action3 = await store.dispatch(
        removeFollowing({followingId: 2}),
    )

    const [id, username, password] = store.getState().auth.userToken.split('_');
    const uid = Number(id);
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();
    const userRes = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await userRes.json();
    for (let i = 0; i < posts.length; i++) {
        posts[i]['author'] = users.find(user => user.id === posts[i].userId).username;
        posts[i]['textOnly'] = false;
    }

    const authorIds = [1, 3, 4];
    const userPosts = posts.filter(post => authorIds.includes(post.userId));
    const newFollowings = users.filter(user => user.id === 3 || user.id === 4);

    expect(store.getState().auth.posts.length).toBe(userPosts.length);
    expect(store.getState().auth.posts).toEqual(userPosts);
    expect(store.getState().auth.followings.length).toBe(2);
    expect(store.getState().auth.followings).toEqual(newFollowings);
});