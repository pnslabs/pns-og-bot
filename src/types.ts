export type IMessageCount = {
  [userId: string]: {
    date: Date;
    count: number;
    twitterUsername: string;
  };
};

export type IMessage = {
  author: { bot: any; id: any };
  guild: any;
  channel: { send: (arg0: string) => void; id: string };
  content: string;
  createdAt: Date;
};

export type IMember = { roles: { add: (arg0: string) => Promise<any> } };
