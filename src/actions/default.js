import { toastr } from 'react-redux-toastr';

export const request = type => () => ({type});
export const success = type => payload => ({type, payload});
export const fail = type => error => ({type, error});

export const callAPI = ({url, params, requestAction, successAction, failAction}) => {
    return dispatch => {
        dispatch(requestAction());
        return fetch(url, params)
            .then(async response => {
                const json = await response.json();        
                switch (response.status) {
                    case 200:
                        return json;
                    case 400:
                    case 401:
                    case 409:
                        throw json;
                    default:
                        throw { message: 'An error occured' };
                }
            })
            .then(json => {
                localStorage.setItem('sa_token', json.token);
                dispatch(successAction(json));
            })
            .catch(error => {
                toastr.error('Error', error.message);
                dispatch(failAction(error));
                return error;
            });
    };
};
