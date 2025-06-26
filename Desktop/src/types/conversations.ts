export enum MessageType {
  EMAIL = 'email',
  SMS = 'sms',
  CALL = 'call',
  NOTE = 'note',
  WHATSAPP = 'whatsapp'
}

export enum MessageDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound'
}

export enum MessageStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  DRAFT = 'draft'
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
}

export interface ConversationMetadata {
  [key: string]: any;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  source?: string;
}

export interface ConversationCreate {
  client_id?: string;
  subject?: string;
  message_type: MessageType;
  direction: MessageDirection;
  content: string;
  html_content?: string;
  status?: MessageStatus;
  thread_id?: string;
  reply_to_id?: string;
  external_message_id?: string;
  attachments?: Attachment[];
  metadata?: ConversationMetadata;
}

export interface ConversationUpdate {
  subject?: string;
  content?: string;
  html_content?: string;
  status?: MessageStatus;
  attachments?: Attachment[];
  metadata?: ConversationMetadata;
}

export interface Conversation {
  id: string;
  user_id: string;
  client_id?: string;
  subject?: string;
  message_type: MessageType;
  direction: MessageDirection;
  content: string;
  html_content?: string;
  status: MessageStatus;
  thread_id?: string;
  reply_to_id?: string;
  external_message_id?: string;
  attachments: Attachment[];
  metadata: ConversationMetadata;
  embedding_generated: boolean;
  embedding_updated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationFilters {
  skip?: number;
  limit?: number;
  client_id?: string;
  message_type?: MessageType;
  status?: MessageStatus;
}

export interface SimilaritySearchRequest {
  query: string;
  match_threshold?: number;
  match_count?: number;
  filter_client_id?: string;
}

export interface SimilaritySearchResult {
  conversation_id: string;
  content_text: string;
  similarity: number;
  conversation_subject?: string;
  conversation_created_at: string;
  client_id?: string;
}

export interface ConversationEmbedding {
  id: string;
  conversation_id: string;
  content_text: string;
  embedding_model: string;
  chunk_index: number;
  metadata: ConversationMetadata;
  created_at: string;
  updated_at: string;
}