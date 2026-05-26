import { EmailConfirmationStatus } from "./email.confirmation-status";

export interface EmailConfirmationResponse {
  status: EmailConfirmationStatus;
  accessToken: string | null;
  email: string | null;
}
