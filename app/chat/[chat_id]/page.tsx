import React from 'react';
import ChatPage from '@/app/components/chatPage';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

const Chat = async ({params}:{params:{chat_id:string}}) => {
    const chatId = (await params).chat_id;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect('/user/signin');
    }
    return (
        <ChatPage chatId={chatId} sessionObj={session}/>
    );
};

export default Chat;