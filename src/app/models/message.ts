export interface IMessage {
  id: string;
  from_user: string;
  channel_id: string;
  content: string;
  ts: number;
}

export interface IMessageGroup {
  from_user: string;
  username: string;
  lines: string[];
  ts: number;
  isOwn: boolean;
}
