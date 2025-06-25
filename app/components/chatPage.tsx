"use client";
import { set } from 'date-fns';
import { tr } from 'date-fns/locale';
import React, { useRef, useState } from 'react'

interface ChatHistoryProps {
    msg: string;
    sender: string;
}

const ChatPage = ({chatId}:{chatId:string}) => {


    const [chatType, setChatType] = useState<string>(chatId);
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
                return newChat;
            });

        }
        

        }
    }

  return (
    <>
    {/*
        <div className='flex flex-row h-screen bg-black text-white w-full'>
        <div className="flex flex-col h-screen w-full">
            <header className="p-4 bg-gray-800 border-b border-gray-300">
                <h1 className="text-lg font-bold">Chat</h1>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                {chatDisplay.length === 0 ? (
                <p>Welcome to the chat({chatId})!</p>
                ):(
                <div className="space-y-2" ref={chatLogs}>
                    {chatDisplay.map((msg, index) => (
                        <div key={index} id={`lastChatLog`} className="p-2 bg-gray-600 rounded shadow">
                            {msg.sender}: {msg.msg}
                        </div>
                    ))}
                </div>
                )}
            </main>
            <footer className="p-4 flex flex-row gap-3 bg-gray-800 border-t border-gray-300">
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
    */}
    <div className='flex flex-row h-screen w-screen font-[Poppins] bg-[#212121]'>
        {/* <div className='w-[336px]'>

        </div> */}
        <div className='mx-auto my-auto '>
            <div className='flex flex-col mb-10 items-center justify-center text-4xl text-center'>
                <span className='text-[#999a9d]'>Good to See You!</span>
                <span className='bg-gradient-to-r bg-clip-text text-transparent from-[#b2b2b4] via-[white] to-[#b2b2b4]'>Your perfect trip starts here.</span>
            </div>
            <div className='w-full rounded-3xl bg-[#303030] p-4'>
                <input type="text" className='text-white outline-0' placeholder='Ask Anything...'/>
                <div className=' flex flex-row justify-between items-center  mt-4'>
                    <div className='flex flex-row gap-2'>
                        <button className='gap-2 min-h-10 min-w-10 flex items-center justify-center border-[#d3d3d3] rounded-full hover:bg-[#50505039] cursor-pointer transition-colors shadow-lg'
                            onClick={() => {
                                setChatType("Build");
                            }}
                            style={{
                                border: chatType === "Build" ? "2px solid #007bff" : "2px solid transparent",
                                color: chatType === "Build" ? "#007bff" : "#d3d3d3",
                                paddingLeft: chatType === "Build" ? "16px" : "0",
                                paddingRight: chatType === "Build" ? "16px" : "0",
                            }}
                        >
                            <span className='material-icons' style={{ fontSize: 20 }}>build</span>
                                {chatType === "Build" && (
                                <span className='text-[14px] font-medium'>Build</span>
)}
                        </button>
                        <button className='gap-2 min-h-10 min-w-10 flex items-center justify-center border-[#d3d3d3] rounded-full hover:bg-[#50505039] cursor-pointer transition-colors shadow-lg'
                            onClick={() => {
                                setChatType("Edit");
                            }}
                            style={{
                                border: chatType === "Edit" ? "2px solid #007bff" : "2px solid transparent",
                                color: chatType === "Edit" ? "#007bff" : "#d3d3d3",
                                paddingLeft: chatType === "Edit" ? "16px" : "0",
                                paddingRight: chatType === "Edit" ? "16px" : "0",
                            }}
                        >
                            <span className='material-icons' style={{ fontSize: 20 }}>edit</span>
                                {chatType === "Edit" && (
                                <span className='text-[14px] font-medium'>Edit</span>
)}
                        </button>
                        <button className='gap-2 min-h-10 min-w-10 flex items-center justify-center border-[#d3d3d3] rounded-full hover:bg-[#50505039] cursor-pointer transition-colors shadow-lg'
                            onClick={() => {
                                setChatType("Analyze");
                            }}
                            style={{
                                border: chatType === "Analyze" ? "2px solid #007bff" : "2px solid transparent",
                                color: chatType === "Analyze" ? "#007bff" : "#d3d3d3",
                                paddingLeft: chatType === "Analyze" ? "16px" : "0",
                                paddingRight: chatType === "Analyze" ? "16px" : "0",
                            }}
                        >
                            <span className='material-icons' style={{ fontSize: 20 }}>bar_chart</span>
                                {chatType === "Analyze" && (
                                <span className='text-[14px] font-medium'>Analyze</span>
)}
                        </button>
                    </div>
                    <button className='material-icons bg-white rounded-full p-1.5'>arrow_upward</button>

                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default ChatPage