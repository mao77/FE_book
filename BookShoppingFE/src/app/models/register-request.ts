export interface RegisterRequest {
  email: string;
  name: string;
  otp: number;
  newPass: string;
  confirmPass: string;
}
