import authReducer from './authSlice';
import { userLogin, userRegister } from './authAction';
import { configureStore } from '@reduxjs/toolkit';
import { logout } from './authSlice';

test("should log in a previously registered user", async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({
            username: 'Bret',
            password: 'Kulas Light'
        })
    );

    expect(action.type).toBe('auth/login/fulfilled');
    expect(localStorage.getItem('userToken')).toBe('1_Bret_Kulas Light');
    expect(store.getState().auth.userToken).toBe('1_Bret_Kulas Light');
    expect(store.getState().auth.error).toBeNull();

    const action2 = await store.dispatch(
        userRegister({
            username: 'CM',
            email: 'a@a.com',
            phoneNumber: '1234567890',
            zipcode: '12345',
            password: 'Aa12345678!',
        })
    );

    expect(action2.type).toBe('auth/register/fulfilled');
    expect(localStorage.getItem('userToken')).toBe('100_CM_Aa12345678!');
    expect(store.getState().auth.userToken).toBe('100_CM_Aa12345678!');
    expect(store.getState().auth.error).toBeNull();
});

test("should not log in an invalid user", async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({username: 'invalid user', password: '12345678'})
    );

    expect(action.type).toBe('auth/login/rejected');
    expect(localStorage.getItem('userToken')).toBe(null);
    expect(store.getState().auth.userToken).toBe(null);
    expect(store.getState().auth.error).toBe("Incorrect username or password");
});

test("should log out a user", async () => {
    let store = configureStore({ reducer: { auth: authReducer } });
    localStorage.clear();

    const action = await store.dispatch(
        userLogin({username: 'Bret', password: 'Kulas Light'})
    );

    // test login first
    expect(action.type).toBe('auth/login/fulfilled');
    expect(localStorage.getItem('userToken')).toBe('1_Bret_Kulas Light');
    expect(store.getState().auth.userToken).toBe('1_Bret_Kulas Light');
    expect(store.getState().auth.error).toBe(null);

    // then logout
    const action2 = store.dispatch(
        logout(),
    );

    expect(localStorage.getItem('userToken')).toBe(null);
    expect(store.getState().auth.userToken).toBe(null);
});