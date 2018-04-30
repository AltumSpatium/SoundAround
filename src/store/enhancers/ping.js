export const ping = store => next => action => {
    console.log(
        `Тип события: ${action.type},`,
        action.payload === undefined ? 
            (action.error === undefined ? '' : `cообщение об ошибке: ${JSON.stringify(action.error.message)}`) :
            `дополнительные данные события: ${JSON.stringify(action.payload)},`,
        `время возникновения события: ${new Date().toTimeString()}`);
    return next(action);
}
