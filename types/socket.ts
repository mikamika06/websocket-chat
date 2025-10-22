import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export interface Message {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface SystemMessage {
  type: 'join' | 'leave';
  username: string;
  timestamp: number;
}
