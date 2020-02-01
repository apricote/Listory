export class CreateOrUpdateDto {
  displayName: string;
  photo?: string;

  spotify: {
    id: string;
    accessToken: string;
    refreshToken: string;
  };
}
