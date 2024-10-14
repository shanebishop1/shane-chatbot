export type Message = {
    id: number;
    sender: string;
    text: string;
    context: string;
    timestamp: number;
};

export type MessageContextType = {
    messages: Message[];
    pushMessage: (newMessage: Message) => void;
    clearMessages: () => void;
};