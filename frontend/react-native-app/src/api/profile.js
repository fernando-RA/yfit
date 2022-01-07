import {request} from '../utils/http';

export const getUserSelf = ({token}) => {
  request.defaults.headers.common.Authorization = 'Token ' + token;
  return request.get('/api/v1/profile/get_user_profile/');
};
