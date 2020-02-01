export class LoginDto {
  accessToken: string;
  refreshToken: string;
  profile: {
    id: string;
    displayName: string;
    photos: string[];
  };
}
