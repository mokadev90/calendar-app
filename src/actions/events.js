import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';
import { prepareEvents } from '../helpers/prepareEvents';
import Swal from 'sweetalert2';

export const eventStartAddNew = (event) => async (dispatch, getState) => {
  const { uid, name } = getState().auth;

  try {
    const res = await fetchConToken('events', event, 'POST');
    const body = await res.json();
    if (body.ok) {
      event.id = body.evento.id;
      event.user = {
        _id: uid,
        name: name,
      };
      dispatch(eventAddNew(event));
    }
  } catch (error) {
    console.log(error);
  }
};

const eventAddNew = (event) => ({
  type: types.eventAddNew,
  payload: event,
});

export const eventSetActive = (event) => ({
  type: types.eventSetActive,
  payload: event,
});

export const eventClearActiveEvent = () => ({
  type: types.eventClearActiveEvent,
});

export const eventStartUpdate = (event) => async (dispatch, getState) => {
  const { uid } = getState().auth;
  console.log('event', event);
  console.log('uid', uid);

  if (uid !== event.user._id) {
    Swal.fire(
      'Error',
      'No puedes actualizar el evento de otra persona',
      'error'
    );
    return;
  }

  try {
    const res = await fetchConToken(`events/${event.id}`, event, 'PUT');
    const body = await res.json();
    console.log(body);
    if (!body.ok) {
      Swal.fire('Error', body.msg, 'error');
    }
    dispatch(eventUpdated(event));
  } catch (error) {
    console.log(error);
  }
};

const eventUpdated = (event) => ({
  type: types.eventUpdated,
  payload: event,
});

export const eventStartDeleted = () => async (dispatch, getState) => {
  const { uid } = getState().auth;
  const {
    id,
    user: { _id },
  } = getState().calendar.activeEvent;

  if (uid !== _id) {
    Swal.fire('Error', 'No puedes eliminar el evento de otra persona', 'error');
    return;
  }

  try {
    const res = await fetchConToken(`events/${id}`, {}, 'DELETE');
    const body = await res.json();
    console.log(body);
    if (!body.ok) {
      Swal.fire('Error', body.msg, 'error');
    }
    dispatch(eventDeleted(id));
  } catch (error) {
    console.log(error);
  }
};

export const eventDeleted = (event) => ({
  type: types.eventDeleted,
  payload: event,
});

export const eventStartLoading = () => async (dispatch) => {
  try {
    const res = await fetchConToken('events');
    const body = await res.json();

    const events = prepareEvents(body.eventos);
    if (body.ok) {
      dispatch(eventLoaded(events));
    }
  } catch (error) {
    console.log(error);
  }
};

const eventLoaded = (events) => ({
  type: types.eventLoaded,
  payload: events,
});

export const eventsCleared = () => ({
  type: types.eventLogout,
});
