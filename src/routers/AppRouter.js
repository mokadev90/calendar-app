import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import { startChecking } from '../actions/auth';
import { LoginScreen } from '../components/auth/LoginScreen';
import { CalendarScreen } from '../components/calendar/CalendarScreen';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {
  const dispatch = useDispatch();
  const { checking, uid } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(startChecking());
  }, [dispatch]);
  if (checking) {
    return <h5>Espere...</h5>;
  }
  return (
    <BrowserRouter>
      <div className="">
        <Switch>
          <PublicRoute
            exact
            isLoggedIn={!!uid}
            path="/login"
            component={LoginScreen}
          />
          <PrivateRoute
            exact
            isLoggedIn={!!uid}
            path="/"
            component={CalendarScreen}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    </BrowserRouter>
  );
};
