export interface ApiToken {
  id: string;
  description: string;
  prefix: string;
  createdAt: string;
  revokedAt: string | null;
}

export interface NewApiToken {
  id: string;
  description: string;
  token: string;
  createdAt: string;
}
