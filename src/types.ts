export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  dueDate: string;
}

export interface SendMessageResponse {
  success: boolean;
  message: string;
  clientId?: string;
}