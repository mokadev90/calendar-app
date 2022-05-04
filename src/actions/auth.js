import Swal from 'sweetalert2';
import { fetchConToken, fetchSinToken } from '../helpers/fetch';
import { types } from '../types/types';
import { eventsCleared } from './events';

export const startLogin = (email, password) => async (dispatch) => {
  const res = await fetchSinToken('auth', { email, password }, 'POST');
  const body = await res.json();
  if (body.ok) {
    localStorage.setItem('token', body.token);
    localStorage.setItem('token-init-state', new Date().getTime());

    dispatch(login({ uid: body.uid, name: body.name }));
  } else {
    Swal.fire('Error', body.msg, 'error');
  }
};

const login = (user) => ({
  type: types.authLogin,
  payload: user,
});

export const startRegister = (email, password, name) => async (dispatch) => {
  const res = await fetchSinToken(
    'auth/new',
    { email, password, name },
    'POST'
  );
  const body = await res.json();
  if (body.ok) {
    localStorage.setItem('token', body.token);
    localStorage.setItem('token-init-state', new Date().getTime());

    dispatch(login({ uid: body.uid, name: body.name }));
  } else {
    Swal.fire('Error', body.msg, 'error');
  }
};

export const startChecking = () => async (dispatch) => {
  const res = await fetchConToken('auth/renew');
  const body = await res.json();
  if (body.ok) {
    localStorage.setItem('token', body.token);
    localStorage.setItem('token-init-state', new Date().getTime());

    dispatch(login({ uid: body.uid, name: body.name }));
  } else {
    dispatch(checkingFinish());
  }
};

export const checkingFinish = () => ({
  type: types.authCheckingFinish,
});

export const startLogout = () => async (dispatch) => {
  localStorage.clear();
  dispatch(logout());
  dispatch(eventsCleared());
};

const logout = () => ({ type: types.authLogout });
