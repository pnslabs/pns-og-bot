export type IMessageCount = {
  [userId: string]: number;
};

export type IMessage = {
  author: { bot: any; id: any };
  guild: any;
  channel: { send: (arg0: string) => void };
};
