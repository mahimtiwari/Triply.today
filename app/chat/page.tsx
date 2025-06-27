import React from 'react';
import ChatPage from '@/app/components/chatPage';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const Chat = async () => {
    const session = await getServerSession(authOptions);

    return (
        <ChatPage sessionObj={session}/>
    );
};

export default Chat;