export interface User {
  userId: number;
  username: string;
  email: string;
  authorities?: { authority: string }[];
}
