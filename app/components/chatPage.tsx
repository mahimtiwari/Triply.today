"use client";
import { set } from 'date-fns';
import { tr } from 'date-fns/locale';
import React, { useRef, useState } from 'react'

interface ChatHistoryProps {
    msg: string;
    sender: string;
}

const ChatPage = ({chatId}:{chatId:string}) => {



    const chatLogs = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState<string>("");
    const [chatDisplay, setChatDisplay] = useState<ChatHistoryProps[]>([]);
    async function  msgSend() {
        setChatDisplay([...chatDisplay, {msg: prompt, sender: "user"}]);
        if (prompt !== "") {
        const convStreamFetch = await fetch("/api/conversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversationId: chatId,
                message: prompt,
            }),
        })
        setPrompt("");

        const stream = convStreamFetch.body;
        if (!stream) {
            console.error("Error:  stream not fnd");
            return;
        }
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        let dmsg = true;
        let fMsg = "";
        setChatDisplay((prev) => [...prev, {msg: fMsg, sender: "bot"}]);

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            const text = decoder.decode(value, { stream: true });
            fMsg+=text;
            setChatDisplay((prev) => { 
                const newChat = [...prev];
                newChat[newChat.length - 1].msg = fMsg;
                console.log(newChat);
                return newChat;
            });

        }
        

        }
    }

  return (
<div className='flex flex-row h-screen bg-gray-50 w-full'>
        <div>
            <nav className="p-4 w-50 bg-gray-100 border-b h-full border-gray-300">
                <ul className="space-y-2">
                    <li><a href="/chat/1" className="text-blue-600 hover:underline">Chat 1</a></li>
                    <li><a href="/chat/2" className="text-blue-600 hover:underline">Chat 2</a></li>
                    <li><a href="/chat/3" className="text-blue-600 hover:underline">Chat 3</a></li>
                </ul>
            </nav>
        </div>
        <div className="flex flex-col h-screen w-full">
            <header className="p-4 bg-gray-100 border-b border-gray-300">
                <h1 className="text-lg font-bold">Chat</h1>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                {chatDisplay.length === 0 ? (
                <p>Welcome to the chat({chatId})!</p>
                ):(
                <div className="space-y-2" ref={chatLogs}>
                    {chatDisplay.map((msg, index) => (
                        <div key={index} id={`lastChatLog`} className="p-2 bg-white rounded shadow">
                            {msg.sender}: {msg.msg}
                        </div>
                    ))}
                </div>
                )}
            </main>
            <footer className="p-4 flex flex-row gap-3 bg-gray-100 border-t border-gray-300">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 rounded border border-gray-300"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button className='p-2 bg-blue-300 rounded-xl'
                onClick={msgSend}>
                    Send
                </button>
            </footer>
        </div>
        </div>
  )
}

export default ChatPage