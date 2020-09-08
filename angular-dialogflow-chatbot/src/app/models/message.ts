export class Message {
  content: string;
  avatar: string;
  timestamp: Date;

  constructor(content: string, avatar: string, timestamp: Date) {
    this.content = content;
    this.avatar = avatar;
    this.timestamp = timestamp;
  }
}
