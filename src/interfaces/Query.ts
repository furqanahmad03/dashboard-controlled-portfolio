export interface ContactQueryReply {
  id?: string;
  queryId: string;
  subject: string;
  message: string;
  recipientEmail: string;
  senderEmail: string;
  emailMessageId?: string | null;
  createdAt?: Date | string;
}

export interface ContactQuery {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  replies?: ContactQueryReply[];
  _count?: {
    replies: number;
  };
}
