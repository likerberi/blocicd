import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ProposalsService } from '../proposals/proposals.service';

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: any;

  constructor(private readonly proposalsService: ProposalsService) {}

  handleConnection(client: any): void {
    client.emit('connected', { ok: true });
  }

  @SubscribeMessage('join_room')
  async joinRoom(
    @ConnectedSocket() client: any,
    @MessageBody() payload: { roomId: string; proposalId: number; actorUserId?: number },
  ) {
    // Socket.IO room: 특정 roomId를 구독한 소켓에게만 메시지를 브로드캐스트하는 논리 채널입니다.
    client.join(payload.roomId);
    await this.proposalsService.markChatting(payload.proposalId, payload.actorUserId);
    return { joined: payload.roomId };
  }

  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() payload: { roomId: string; senderId: number; content: string },
  ) {
    this.server.to(payload.roomId).emit('new_message', {
      senderId: payload.senderId,
      content: payload.content,
      sentAt: new Date().toISOString(),
    });
    return { sent: true };
  }
}
