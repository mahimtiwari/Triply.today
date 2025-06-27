import React from 'react';
import ChatPage from '@/app/components/chatPage';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Chat = async ({params}:{params:{chat_id:string}}) => {
    const chatId = (await params).chat_id;
    const session = await getServerSession(authOptions);

    return (
        <ChatPage chatId={chatId} sessionObj={session}/>
    );
};

export default Chat;