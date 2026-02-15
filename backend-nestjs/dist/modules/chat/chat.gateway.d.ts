import { OnGatewayConnection } from '@nestjs/websockets';
import { ProposalsService } from '../proposals/proposals.service';
export declare class ChatGateway implements OnGatewayConnection {
    private readonly proposalsService;
    server: any;
    constructor(proposalsService: ProposalsService);
    handleConnection(client: any): void;
    joinRoom(client: any, payload: {
        roomId: string;
        proposalId: number;
        actorUserId?: number;
    }): Promise<{
        joined: string;
    }>;
    sendMessage(payload: {
        roomId: string;
        senderId: number;
        content: string;
    }): {
        sent: boolean;
    };
}
