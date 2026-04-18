export const BURGER_API_URL = 'https://norma.education-services.ru/api';

const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

export const request = <T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> =>
  fetch(`${BURGER_API_URL}${endpoint}`, options).then(checkResponse<T>);

export const refreshToken = (): Promise<any> =>
  request<any>('/auth/token', {
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
      if (!refreshData.success) return Promise.reject(refreshData);
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
  request<any>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const registerUserApi = (data: any) =>
  request<any>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const logoutApi = () =>
  request<any>('/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: localStorage.getItem('refreshToken') })
  });

export const getUserApi = () =>
  fetchWithRefresh<any>('/auth/user', {
    method: 'GET',
    headers: { Authorization: localStorage.getItem('accessToken') || '' }
  });

export const updateUserApi = (data: any) =>
  fetchWithRefresh<any>('/auth/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken') || ''
    },
    body: JSON.stringify(data)
  });

export const getFeedsApi = () => request<any>('/orders/all');

export const orderBurgerApi = (ingredients: string[]) =>
  fetchWithRefresh<any>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken') || ''
    },
    body: JSON.stringify({ ingredients })
  });

export const getOrderByNumberApi = (number: number) =>
  request<{ success: boolean; orders: any[] }>(`/orders/${number}`).then(
    (res) => res.orders[0]
  );

export const forgotPasswordApi = (data: { email: string }) =>
  request<any>('/password-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

export const resetPasswordApi = (data: any) =>
  request<any>('/password-reset/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
