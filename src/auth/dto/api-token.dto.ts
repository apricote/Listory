export interface ApiTokenDto {
  id: string;
  description: string;
  prefix: string;
  createdAt: Date;
  revokedAt: Date | null;
}
