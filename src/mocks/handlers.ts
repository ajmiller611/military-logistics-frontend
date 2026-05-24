import { http, HttpResponse } from 'msw';
import { api } from './api';

export const mockUser = {
  userId: 1,
  username: 'user1',
  email: 'user1@example.com',
};

export const handlers = [
  http.post(api.users(), async () => {
    return HttpResponse.json(
      { message: 'User created successfully!' },
      { status: 201 },
    );
  }),
  http.get(api.userById(), () => {
    return HttpResponse.json({ data: mockUser });
  }),
  http.put(api.userById(), async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: body });
  }),
  http.post(api.inventory(), async () => {
    return HttpResponse.json(
      { message: 'Item created successfully!' },
      { status: 201 },
    );
  }),
];
