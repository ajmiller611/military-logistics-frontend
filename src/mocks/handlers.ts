import { http, HttpResponse } from 'msw';
import { UserInput, userSchema } from '@/schemas/userSchema';

export const handlers = [
  http.post('http://localhost:8080/users/', async ({ request }) => {
    const userData: UserInput = userSchema.parse(await request.json());

    if (userData.username === 'existingUser') {
      return HttpResponse.json(
        { message: 'Username already taken' },
        { status: 409 },
      );
    } else if (userData.username === 'invalidUsername') {
      return HttpResponse.json({ message: 'Invalid input' }, { status: 400 });
    }

    return HttpResponse.json(
      { message: 'User created successfully!' },
      { status: 201 },
    );
  }),
];
