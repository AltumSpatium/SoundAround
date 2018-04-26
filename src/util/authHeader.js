export const authHeader = () => {
    const token = localStorage.getItem('as_token');
    if (token) {
        return { 'Authorization': 'Bearer ' + token };
    } else return {};
};
