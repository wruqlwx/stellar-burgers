export const BURGER_API_URL =
  process.env.BURGER_API_URL || 'https://norma.education-services.ru/api';

interface TServerResponse<T> {
  success: boolean;
  message?: string;
}

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const request = <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> =>
  fetch(`${BURGER_API_URL}${endpoint}`, options).then(checkResponse<T>);

export interface TAuthResponse extends TServerResponse<any> {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
}

export const refreshToken = (): Promise<TAuthResponse> =>
  request<TAuthResponse>('/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  });

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: any
): Promise<T> => {
  try {
    return await request<T>(endpoint, options);
  } catch (err: any) {
    if (err.message === 'jwt expired') {
      const refreshData = await refreshToken();
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      localStorage.setItem('accessToken', refreshData.accessToken);
      options.headers.Authorization = refreshData.accessToken;
      return await request<T>(endpoint, options);
    }
    return Promise.reject(err);
  }
};

export const getIngredientsApi = () =>
  request<{ success: boolean; data: any[] }>('/ingredients').then(
    (res) => res.data
  );

export const loginUserApi = (data: any) =>
  request<TAuthResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const registerUserApi = (data: any) =>
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
  fetchWithRefresh<{ success: boolean; user: any }>('/auth/user', {
    method: 'GET',
    headers: { Authorization: localStorage.getItem('accessToken') || '' }
  });

export const updateUserApi = (data: any) =>
  fetchWithRefresh<{ success: boolean; user: any }>('/auth/user', {
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
    orders: any[];
    total: number;
    totalToday: number;
  }>('/orders/all');

export const getOrderByNumberApi = (number: number) =>
  request<{ success: boolean; orders: any[] }>(`/orders/${number}`).then(
    (res) => res.orders[0]
  );

export const orderBurgerApi = (ingredients: string[]) =>
  fetchWithRefresh<{ success: boolean; order: any }>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken') || ''
    },
    body: JSON.stringify({ ingredients })
  });

export const forgotPasswordApi = (data: { email: string }) =>
  request<TServerResponse<any>>('/password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const resetPasswordApi = (data: any) =>
  request<TServerResponse<any>>('/password-reset/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
