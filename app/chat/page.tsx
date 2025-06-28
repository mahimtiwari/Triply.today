import React from 'react';
import ChatPage from '@/app/components/chatPage';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';
const Chat = async () => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect('/user/signin');
    }
    return (
        <ChatPage sessionObj={session}/>
    );
};

export default Chat;