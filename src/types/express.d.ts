declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string | undefined;
        token: string;
      };
    }
  }
}

export {};
