import { TIngredient, TOrder, TUser } from '@utils-types';

export const BURGER_API_URL = process.env.BURGER_API_URL;

interface TServerResponse<T> {
  success: boolean;
  message?: string;
}

interface TPasswordResetRequest {
  email: string;
}

interface TPasswordResetConfirm {
  password: string;
  token: string;
}

export type TCredentials = {
  email: string;
  password: string;
};

export type TRegisterCredentials = TCredentials & {
  name: string;
};

export type TUpdateUserData = Partial<TCredentials> & {
  name?: string;
};

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const request = <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> =>
  fetch(`${BURGER_API_URL}${endpoint}`, options).then(checkResponse<T>);

export interface TAuthResponse extends TServerResponse<TUser> {
  accessToken: string;
  refreshToken: string;
  user: TUser;
}

export const refreshToken = (): Promise<TAuthResponse> =>
  request<TAuthResponse>('/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  });

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (err: unknown) {
    const error = err as { message: string };
    if (error.message === 'jwt expired') {
      const refreshData = await refreshToken();
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      localStorage.setItem('accessToken', refreshData.accessToken);
      options.headers = {
        ...options.headers,
        Authorization: refreshData.accessToken
      };
      return await request<T>(endpoint, options);
    }
    return Promise.reject(err);
  }
};

export const getIngredientsApi = () =>
  request<{ success: boolean; data: TIngredient[] }>('/ingredients').then(
    (res) => res.data
  );

export const loginUserApi = (data: TCredentials) =>
  request<TAuthResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const registerUserApi = (data: TRegisterCredentials) =>
  request<TAuthResponse>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const logoutApi = () =>
  request<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  });

export const getUserApi = () =>
  fetchWithRefresh<{ success: boolean; user: TUser }>('/auth/user', {
    method: 'GET',
    headers: { Authorization: localStorage.getItem('accessToken') || '' }
  });

export const updateUserApi = (data: TUpdateUserData) =>
  fetchWithRefresh<{ success: boolean; user: TUser }>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken') || ''
    },
    body: JSON.stringify(data)
  });

export const getFeedsApi = () =>
  request<{
    success: boolean;
    orders: TOrder[];
    total: number;
    totalToday: number;
  }>('/orders/all');

export const getOrderByNumberApi = (number: number) =>
  request<{ success: boolean; orders: TOrder[] }>(`/orders/${number}`).then(
    (res) => res.orders[0]
  );

export const orderBurgerApi = (ingredients: string[]) =>
  fetchWithRefresh<{ success: boolean; order: TOrder }>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken') || ''
    },
    body: JSON.stringify({ ingredients })
  });

export const forgotPasswordApi = (data: TPasswordResetRequest) =>
  request<TServerResponse<void>>('/password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const resetPasswordApi = (data: TPasswordResetConfirm) =>
  request<TServerResponse<void>>('/password-reset/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
