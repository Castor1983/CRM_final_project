interface CustomRequest extends Request {
  manager?: {
    managerId: string;
    email: string;
    role: string;
    surname: string;
  };
}
