import React from 'react';
import ChatPage from '@/app/components/chatPage';
const Chat = async ({params}:{params:{chat_id:string}}) => {
    const chatId = (await params).chat_id;


    return (
        <ChatPage chatId={chatId} />
    );
};

export default Chat;