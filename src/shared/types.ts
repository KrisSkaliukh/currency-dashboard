export type AuthUserType = {
  email: string;
};

export type AuthStateType = {
  user: AuthUserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
