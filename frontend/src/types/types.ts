export type Message = {
    id: number;
    sender: string;
    text: string;
    context: string;
    timestamp: string;
};

export type MessageContextType = {
    messages: Message[];
    pushMessage: (newMessage: Message) => void;
    clearMessages: () => void;
    setMessages: (messages: Message[]) => void;
};
