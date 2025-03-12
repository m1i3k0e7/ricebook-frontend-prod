import authReducer from '../auth/authSlice';
import { userLogin, getPosts, addFollowing, removeFollowing, userGetCredential } from '../auth/authAction';
import { configureStore } from '@reduxjs/toolkit';

test("should fetch the logged in user's profile username", async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({username: 'Bret', password: 'Kulas Light'})
    );

    const action2 = await store.dispatch(
        userGetCredential({userToken: store.getState().auth.userToken}),
    )

    expect(store.getState().auth.username).toBe('Bret');
});