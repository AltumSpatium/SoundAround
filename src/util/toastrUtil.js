import { toastr } from 'react-redux-toastr';

const msgTypes = ['success', 'error', 'info', 'warning'];

export const showMessage = (msgTitle, msgText, msgType) => {
    msgType = msgTypes.includes(msgType) ? msgType : 'info';
    toastr[msgType](msgTitle, msgText);
};
