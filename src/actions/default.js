export const request = type => () => ({type});
export const success = type => payload => ({type, payload});
export const fail = type => error => ({type, error});

export const defaultResponseHandler = async response => {
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

export const callAPI = ({
    url, params, requestAction, successAction, failAction,
    onSuccess, onFail, responseHandler=defaultResponseHandler }) => {
    return async dispatch => {
        dispatch(requestAction());
        return fetch(url, params)
            .then(responseHandler)
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

export const createAction = (actionCreator, fieldNames=[]) => {
    if (!actionCreator) throw new Error('Action creator must be provided to create action');
    return function() {
        const args = Array.from(arguments);
        const actionParams = [];

        if (args.length) {
            let argument = args.length === 1 ? args[0] : null;

            if (!argument && fieldNames.length) {
                argument = {};
                for (const [index, arg] of args.entries()) {
                    if (fieldNames[index]) {
                        argument[fieldNames[index]] = arg;
                    }
                }
            }

            if (argument) actionParams.push(argument)
        }

        return async dispatch => dispatch(actionCreator.apply(null, actionParams));
    };
};
