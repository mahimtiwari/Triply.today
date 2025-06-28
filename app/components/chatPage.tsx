"use client";
import React, { useRef, useState, useEffect } from 'react'
import { Session } from "next-auth";
import { useRouter } from 'next/navigation';
import { useMsgStore } from '@/app/store/chatMsgStore';
import { useConversationHistoryStore } from '../store/chatHistoryStore';
import Image from 'next/image';
interface ChatHistoryProps {
    msg: string;
    sender: string;
}



const ChatPage = ({chatId, sessionObj}:{chatId?:string, sessionObj:Session}) => {

    const router = useRouter();
    const { pendingMessage, setPendingMessage, clearPendingMessage } = useMsgStore();
    const { conversations, addConversation, setConversations, removeConversation } = useConversationHistoryStore();

    const [chatType, setChatType] = useState<string>("");
    const chatLogs = useRef<HTMLDivElement>(null);
    const [prompt, setPrompt] = useState<string>("");
    const sendBtn = useRef<HTMLButtonElement>(null);
    const [chatDisplay, setChatDisplay] = useState<ChatHistoryProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const processedRef = useRef(false);


    useEffect(() => {
        if (pendingMessage && chatId && !processedRef.current) {
            processedRef.current = true;
            msgSend(pendingMessage);
            clearPendingMessage();

        }
    }, [pendingMessage, chatId]);

    function changeSendBtnSatus(accept: boolean) {
        
    if (sendBtn.current) {
        sendBtn.current.disabled = !accept;
        if (accept) {
            setIsLoading(false);
            sendBtn.current.classList.remove("animate-pulse");
            sendBtn.current.classList.remove("animate-spin");
            sendBtn.current.innerHTML = "arrow_upward";
            sendBtn.current.style.backgroundColor = "#ffffff";
        }else{
            setIsLoading(true);
            sendBtn.current.classList.add("animate-pulse");
            sendBtn.current.classList.add("animate-spin");
            sendBtn.current.innerHTML = "<span class='material-symbols-outlined'>progress_activity</span>";
            sendBtn.current.style.backgroundColor = "#888";
        }
    }
    }


    // async function getChats() {
    //     const convFetch = await fetch("/api/conversation/fetch", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },

    //     });
    //     const convData = await convFetch.json();
    //     const conversations = convData.conversations.map((conversation: any) => {
    //         return {
    //         chatId: conversation.conversation_id,
    //         name: conversation.name,
    //         };
    //     });


    //     return conversations;
    // }
    const [chats, setChats] = useState<any[]>([]);

    useEffect(() => {
        async function fetchConversations() {
            const convFetch = await fetch("/api/conversation/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const convData = await convFetch.json();
            const convs = convData.conversations.map((conversation: any) => {
                return {
                    chatId: conversation.conversation_id,
                    name: conversation.name,
                };
            });
            setChats(convs);
            setConversations(convs);
            return convs;
        }

        async function fetchSetMessages(chatId: string) {

            setIsLoading(true);
            if (sendBtn.current) {
                sendBtn.current.disabled = true;
            }

            const messageFetchObj = await fetch("/api/conversation/messages/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    conversationId: chatId,
                }),
            })
            const msgJson = await messageFetchObj.json();
            if (!msgJson.messages) {
                console.error("Error: messages not found in response");
                return;
            }
            const messages = msgJson.messages.map((message: any) => {
                return {
                    msg: message.message_text,
                    sender: message.sender === "USER" ? "user" : "bot",
                };
            });

            setIsLoading(false);
            if (sendBtn.current) {
                sendBtn.current.disabled = false;
            }

            if (messages.length !== 0) {
            setChatDisplay(messages);
            }


        }

        if (conversations.length === 0) {
            fetchConversations();
        }
        else {
            setChats(conversations);
        }

        if (chatId && !processedRef.current) {
            fetchSetMessages(chatId);
        }




    }, []);

    async function registerChat() {
        const convFetch = await fetch("/api/conversation/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const convData = await convFetch.json();
        if (!convData.chat_id) {
            console.error("Error: chat_id not found in response");
            return;
        }
        addConversation(convData.chat_id, "New Chat");
        router.push(`/chat/${convData.chat_id}`);

    }


    async function  msgSend(nIdPrompt?: string) {
        const msg = nIdPrompt || prompt;
        
        if (!chatId) {
            setPendingMessage(msg);
            registerChat();
            return;
        }

        setPrompt("");
        changeSendBtnSatus(false);
        setChatDisplay([...chatDisplay, {msg: msg, sender: "user"}]);

        if (msg !== "") {
        const convStreamFetch = await fetch("/api/conversation/messages/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversationId: chatId,
                message: msg,
            }),
        })
        

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
                changeSendBtnSatus(true);
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

    const [showPopup, setShowPopup] = useState(false);
    const clkOut = () => {
        setShowPopup(false);
    }

    useEffect(() => {

        if (showPopup) {
            document.addEventListener('click', clkOut);
        }else {
            document.removeEventListener('click', clkOut);
        }
        return () => {
            document.removeEventListener('click', clkOut);
        }
    }, [showPopup]);

    async function deleteConv(){
        if (!chatId) {
            console.error("Error: chatId is not defined");
            return;
        }
        fetch(`/api/conversation/remove`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversationId: chatId,
            }),
        });
        removeConversation(chatId);
        router.push("/chat");

    }

    const sideMenu = useRef<HTMLDivElement>(null);
    const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(true);
    function toggleSideMenu() {
        if (sideMenu.current) {
            if (sideMenuOpen) {
                sideMenu.current.style.width = "fit-content";
            } else {
                sideMenu.current.style.width = "270px";
            }
            setSideMenuOpen(!sideMenuOpen);
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

    
    <div className='flex flex-row h-screen w-screen text-white overflow-hidden font-[Poppins] bg-[#212121]'>
        <div ref={sideMenu} className='w-[270px] bg-black overflow-y-auto'
            style={{
                scrollbarColor: "#444 #000",
                
            }}
        >

            <div className='flex sticky top-0 flex-col bg-[inherit] '>
                <div className='flex flex-row p-3 px-4 justify-between w-full items-center'>
                    {sideMenuOpen && (
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-semibold text-gray-400 select-none">t</span>
                        </div>
                    )}
                    <button 
                    className='p-2 rounded-xl cursor-pointer flex items-center hover:bg-[#333333] transition-colors duration-300'
                    onClick={() => toggleSideMenu()}
                    >
                        <span className="material-symbols-outlined text-gray-200 ">
                            dual_screen
                        </span>
                    </button>
                </div>
                <div className='px-2 flex flex-col'
                style={{
                    alignItems: sideMenuOpen ? "initial" : "center",
                }}
                >
                <button 
                className='w-full flex flex-row cursor-pointer items-center gap-2 text-left px-3 py-2.5 hover:bg-[#333333] rounded-lg transition-colors duration-200 shadow-md'
                style={{
                    width: sideMenuOpen ? "100%" : "fit-content",
                }}
                onClick={() => {
                    router.push("/chat");
                }}
                >
                    <span className="material-symbols-outlined" style={{
                        fontSize: 19,
                        fontWeight: 300,
                        color: "#ffffff",
                    }}>
                        add_comment
                    </span>
                    {sideMenuOpen && (
                    <span className='text-white font-regular text-[13px]'>Start a New Chat</span>
                    )}        
                </button>
                <button 
                style={{
                    width: sideMenuOpen ? "100%" : "fit-content",
                }}
                className='w-full flex flex-row cursor-pointer items-center gap-2 text-left px-3 py-2.5 hover:bg-[#333333] rounded-lg transition-colors duration-200 shadow-md'>
                    <span className="material-symbols-outlined" style={{
                        fontSize: 19,
                        fontWeight: 300,
                        color: "#ffffff",
                    }}>
                        search
                    </span>
                    {sideMenuOpen && (
                    <span className='text-white font-regular text-[13px]'>Search chats</span>
                    )}
                </button>
                </div>

            </div>
            { sideMenuOpen && (
            <div className='text-white  flex flex-col px-2 py-3 gap-1'>
                <span className='text-[#999] text-[14px] px-3'>Hsitory</span>
                <div className=''>
                    {conversations.map((chat, index)=> (
                    <button key={index} 
                    className='hover:bg-[#2d2d2d] cursor-pointer flex flex-row justify-between w-full text-[14px] px-3 py-1.5 rounded-lg'
                    onClick={() => {
                        if (chat.chatId === chatId) {
                            return;
                        }
                        router.push(`/chat/${chat.chatId}`);
                        setChatDisplay([]);
                        setPrompt("");
                    }}
                    >
                        <span>{chat.name}</span>

                    </button>
                    ))}

                </div>
            </div>
            )}
        </div>
        <div 
        className='flex-1 flex flex-col h-screen w-full items-center text-white bg-[#212121] overflow-y-auto'
        style={{
            scrollbarColor: "#444 #000",
        }}
        >
            <div className='w-full h-[65px] sticky top-0 bg-[inherit] justify-between flex items-center px-4 py-2'>
                
                <div className='flex flex-row gap-1'>
                    {chatId && (
                        <>
                            <button className='flex items-center cursor-pointer gap-2 p-2 rounded-xl hover:bg-[#333333] transition-colors duration-300'>
                                <span className="material-symbols-outlined"
                                style={{
                                    fontSize:20,
                                }}
                                >
                                ios_share
                                </span>
                            </button>


                            <div className="relative inline-block"> 
                                    <button onClick={() => setShowPopup(!showPopup)} className='flex items-center cursor-pointer gap-2 p-2 rounded-xl hover:bg-[#333333] transition-colors duration-300'>
                                        <span className='material-icons'>more_horiz</span>
                                    </button>

                                    {showPopup && (
                                            <div className="absolute top-full left-0 bg-[#353535] rounded-xl p-1.25 z-10">
                                                <button className="flex flex-row items-center cursor-pointer rounded-lg text-red-400 hover:bg-red-500/10 text-sm gap-2 px-3 py-1.75"
                                                    onClick={() => {
                                                        deleteConv();
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined"
                                                        style={{
                                                            fontSize: 20,
                                                        }}
                                                    >
                                                        delete
                                                    </span>
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                            </div>
                        </>
                    )}
                </div>
                

                <Image
                src={sessionObj?.user?.image || ''}
                alt="User Profile"
                width={35}
                height={35}
                className="rounded-full"
                />

            </div>

            <div className='h-full w-full p-4 pb-0 flex flex-col max-w-[700px] mx-auto '
                style={{
justifyContent: chatDisplay.length === 0 && !chatId ? "center" : "initial",
alignItems: chatDisplay.length === 0 && !chatId ? "center" : "initial"
                }}
            >
                {chatDisplay.length === 0 && !chatId ? (
                <div className='flex flex-col mb-10 items-center justify-center text-4xl text-center'>
                    <span className='text-[#999a9d]'>Good to See You!</span>
                    <span className='bg-gradient-to-r bg-clip-text text-transparent from-[#b2b2b4] via-[white] to-[#b2b2b4]'>Your perfect trip starts here.</span>
                </div>
                ) : (
                <div className="space-y-2 mb-[calc(15px+100px)] flex flex-col gap-2" ref={chatLogs}>
                    {chatDisplay.map((msg, index) => (
                        <div key={index} className='w-fit' style={{
                            maxWidth: msg.sender === "user" ? "500px" : "intial",
                            backgroundColor: msg.sender === "user" ? "#444" : "initial",
                            borderRadius: "30px",

                            padding: "10px 15px",
                            marginLeft: msg.sender === "user" ? "auto" : "0",
                        }}>
                            {msg.msg}
                        </div>
                    ))}
                </div>
                )}

                <div className='w-full rounded-3xl bg-[#303030] p-4  '
                    style={{
                        position: chatDisplay.length === 0 && !chatId  ? "initial": "sticky",
                        bottom: "15px",
                        marginTop: chatDisplay.length === 0 && !chatId ? "0": "auto",
                    }}
                >

                    <input 
                        className='text-white resize-none ml-2 overflow-hidden w-full outline-0'
                        placeholder='Ask Anything...'
                        value={prompt}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !isLoading) {
                                msgSend();
                            }
                        }}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className=' flex flex-row justify-between items-center  mt-4'>
                        <div className='flex flex-row gap-2'>
                            <button className='gap-2 min-h-10 min-w-10 flex items-center justify-center border-[#d3d3d3] rounded-full hover:bg-[#50505039] cursor-pointer transition-colors shadow-lg'
                                onClick={() => {
                                    if (chatType === "Build") {
                                        setChatType("");
                                        return;
                                    }
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
                                    if (chatType === "Edit") {
                                        setChatType("");
                                        return;
                                    }
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
                                    if (chatType === "Analyze") {
                                        setChatType("");
                                        return;
                                    }
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
                        <button 
                        onClick={() => msgSend()}
                        ref={sendBtn}
                        className='material-icons bg-white text-black rounded-full p-1.5 hover:bg-gray-100 transition-colors duration-300 cursor-pointer'>arrow_upward</button>

                    </div>
                </div>

            </div>
        </div>

    </div>
    </>
  )
}

export default ChatPage