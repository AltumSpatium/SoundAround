export const ping = store => next => action => {
    const error = action.error;
    if (error) {
        console.log(
            `Тип события: ${action.type},`,
            `cообщение об ошибке: ${JSON.stringify(action.error.message)}`,
            `время возникновения события: ${new Date().toTimeString()}`);
    } else {
        let data = action.payload || {};
        console.log(
            `Тип события: ${action.type},`,
            `дополнительные данные события: ${JSON.stringify(data)},`,
            `время возникновения события: ${new Date().toTimeString()}`);        
    }

    return next(action);
}
