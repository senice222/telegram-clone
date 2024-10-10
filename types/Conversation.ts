import {User} from "@/types/User";

export interface ConversationChatProps {
    member: User
    profile: User
}

export interface ConversationType {
    id: string;
    type: 'conversation';
    memberOne: User;
    memberOneId: string;
    memberTwo: User;
    memberTwoId: string;
}
