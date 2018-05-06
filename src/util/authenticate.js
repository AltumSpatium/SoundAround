import jwt from 'jsonwebtoken';
import { getUser } from '../actions/user';

export const authenticate = () => {
    const token = localStorage.getItem('sa_token');
    if (!token) return;
    const payload = jwt.decode(token);
    return getUser(payload.sub);
};
