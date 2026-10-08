import { apiPost } from '../../../helpers/apiHelper'

export const login = ({ email, password }) => apiPost('/auth/login', { email, password }, false)

export const register = ({ name, email, password }) =>
  apiPost('/auth/register', { name, email, password }, false)

export const logout = () => apiPost('/auth/logout')
