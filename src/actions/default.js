export const request = type => () => ({type});
export const success = type => payload => ({type, payload});
export const fail = type => error => ({type, error});

export const processResponse = async response => {
    const json = await response.json();
    switch (response.status) {
        case 200:
            return json;
        case 400:
        case 401:
        case 403:
        case 404:
        case 409:
        case 500:
            throw json;
        default:
            const defaultError = { message: 'An error occured' };
            throw defaultError;            
    }
};

export const callAPI = ({url, params, requestAction, successAction, failAction, onSuccess, onFail}) => {
    return async dispatch => {
        dispatch(requestAction());
        return fetch(url, params)
            .then(processResponse)
            .then(json => {
                if (onSuccess) onSuccess(json);
                dispatch(successAction(json));
            })
            .catch(error => {
                if (onFail) onFail(error);
                dispatch(failAction(error));
                return error;
            });
    };
};
