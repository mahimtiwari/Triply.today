"use client";
import React, { useRef, useState, useEffect, use } from 'react'
import { Session } from "next-auth";
import { useRouter } from 'next/navigation';
import { useMsgStore } from '@/app/store/chatMsgStore';
import { useConversationHistoryStore } from '../store/chatHistoryStore';
import Image from 'next/image';
import ChatSearch from './chatSearch';
import ChatShare from './chatShare';
import ReactMarkdown from 'react-markdown';



interface ChatHistoryProps {
    msg: string;
    sender: string;
}

const ChatPage = ({chatId, sessionObj, share}:{chatId?:string, sessionObj:Session, share:boolean}) => {

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
    const [isResponseBeingGenerated, setIsResponseBeingGenerated] = useState<boolean>(false);

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
    const [ visib, setVisib ] = useState<string>("");
    const [ user, setUser ] = useState<boolean>(false);
    useEffect(() => {
        async function fetchConversations() {
            const convFetch = await fetch("/api/conversation/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const convData = await convFetch.json();

            if (!convData.conversations) {
            setChats([]);
            setConversations([]);
            return [];
            }

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
            setVisib(msgJson.visibility);
            setUser(msgJson.user);
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

    const [userScroll, setUserScroll] = useState<boolean>(false);


    useEffect(() => {
        if(!userScroll) {
            chatLogsScrollRef.current?.scrollTo({
                top: chatLogsScrollRef.current.scrollHeight,
                behavior: "instant",
            });
        }
    }, [chatDisplay, chatId]);

    useEffect(() => {
        const chatElem = chatLogsScrollRef.current;
        if (!chatElem) return;

        const handleScroll = () => {
            const isAtBottom =
            Math.abs(chatElem.scrollTop + chatElem.clientHeight - chatElem.scrollHeight) < 10;
            console.log("isAtBottom:", isAtBottom);
            if (!isAtBottom) {
            setUserScroll(true); 
            } else {
            setUserScroll(false); 
            }
        };

        chatElem.addEventListener("scroll", handleScroll);
        return () => chatElem.removeEventListener("scroll", handleScroll);
    
    }, []);


    async function  msgSend(nIdPrompt?: string) {
        const msg = nIdPrompt || prompt;
        
        if (!chatId) {
            setPendingMessage(msg);
            setChatDisplay([...chatDisplay, {msg: msg, sender: "user"}]);
            registerChat();
            return;
        }

        setPrompt("");
        changeSendBtnSatus(false);
        setChatDisplay([...chatDisplay, {msg: msg, sender: "user"}]);

        if (msg !== "") {
        setIsResponseBeingGenerated(true);
        const convStreamFetch = await fetch("/api/conversation/messages/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                conversationId: chatId,
                message: msg,
                tool: chatType,

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
                setIsResponseBeingGenerated(false);
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
    const sideMenuScreenOverlay = useRef<HTMLDivElement>(null);
    
    useEffect(()=>{
        if (window.innerWidth < 900) {
            if (sideMenu.current) {
                sideMenu.current.style.display = "none";
            }
            setSideMenuOpen(false);
        }
    }, [])
    
    
    function toggleSideMenu() {
        if (sideMenu.current) {
            if (sideMenuOpen) {
                if(window.innerWidth < 900){
                    sideMenu.current.style.display = "none";
                    if (sideMenuScreenOverlay.current) {
                        sideMenuScreenOverlay.current.style.display = "none";
                    }
                }
                
                sideMenu.current.style.width = "fit-content";
            }
            else {
                if(window.innerWidth < 900){
                    sideMenu.current.style.display = "block"
                    if (sideMenuScreenOverlay.current) {
                        sideMenuScreenOverlay.current.style.display = "block";
                    }
                }
                sideMenu.current.style.width = "270px";
            }
            
            setSideMenuOpen(!sideMenuOpen);
        }
    }


    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const [shareOpen, setShareOpen] = useState<boolean>(false);

    const chatLogsScrollRef = useRef<HTMLDivElement>(null);


  return (
    <>
    {searchOpen && (
        <ChatSearch
            onClose={() => setSearchOpen(false)}
            conversations={chats}
            chnageConversation={(id) => {
                if (id === chatId) {
                    return;
                }
                router.push(`/chat/${id}`);
                setChatDisplay([]);
                setPrompt("");
            }}
        />
    )}

    {shareOpen && visib!== "" && (
        <ChatShare
            onClose={() => setShareOpen(false)}
            chatID={chatId}
            visibility={visib}
            changeVisibility={(newVis) => {
                setVisib(newVis);
            }}
        />
    )}

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

    <div 
    className='absolute hidden bg-black/30 h-screen w-screen z-99 backdrop-blur-md'
    ref={sideMenuScreenOverlay}
    onClick={() => {
        toggleSideMenu();
    }}
    >

    </div>

    <div className='flex flex-row h-screen w-screen text-white overflow-hidden font-[Poppins] bg-[#212121]'>
        {share &&  (
            <div ref={sideMenu} className='w-[270px] bg-black overflow-y-auto deskver:static absolute left-0 h-screen z-100 deskver:block hidden'
                style={{
                    scrollbarColor: "#444 #000",
                    
                }}
            >

                <div className='flex sticky top-0 flex-col bg-[inherit] '>
                    <div className='flex flex-row p-3 px-4 justify-between w-full items-center'>
                        {sideMenuOpen && (
                            <a className="flex items-center gap-2" href='/'>
                                <span className="text-3xl font-semibold text-gray-400 select-none">t</span>
                            </a>
                        )}
                        <button 
                        className='p-2 deskver:flex hidden rounded-xl cursor-pointer  items-center hover:bg-[#333333] transition-colors duration-300'
                        onClick={() => toggleSideMenu()}
                        >
                            <span className="material-symbols-outlined text-gray-200 ">
                                dual_screen
                            </span>
                        </button>
                        <button 
                        className='p-2 deskver:hidden flex rounded-xl cursor-pointer  items-center hover:bg-[#333333] transition-colors duration-300'
                        onClick={() => toggleSideMenu()}
                        >
                            <span 
                            style={{
                                fontSize: 19,

                            }}
                            className="material-symbols-outlined text-gray-200 ">
                                close
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
                    onClick={() => setSearchOpen(true)}
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
        )}
        <div 
        className='flex-1 flex flex-col h-screen w-full items-center text-white bg-[#212121] overflow-y-auto'
        style={{
            scrollbarColor: "#444 #000",
        }}
        ref={chatLogsScrollRef}
        >
            { share && (
            <div className='w-full h-[65px] sticky top-0 bg-[inherit] justify-between flex items-center px-4 py-2'>
                
                <div className='flex flex-row gap-1'>
                    <button 
                    className='flex deskver:hidden items-center justify-center cursor-pointer gap-2 h-[40px] w-[40px] p-2 rounded-xl hover:bg-[#333333] transition-colors duration-300'
                    onClick={() => toggleSideMenu()}>
                        <span className="material-symbols-outlined text-gray-200 ">
                            dual_screen
                        </span>
                    </button>
                    {chatId && (
                        <>
                            <button 
                            onClick={()=>{
                                setShareOpen(true);
                            }}
                            className='flex items-center justify-center cursor-pointer gap-2 h-[40px] w-[40px] p-2 rounded-xl hover:bg-[#333333] transition-colors duration-300'>
                                <span className="material-symbols-outlined"
                                style={{
                                    fontSize:20,
                                }}
                                >
                                ios_share
                                </span>
                            </button>

                            <div className="relative inline-block"> 
                                    <button onClick={() => setShowPopup(!showPopup)} className='flex items-center justify-center cursor-pointer gap-2 h-[40px] w-[40px] p-2 rounded-xl hover:bg-[#333333] transition-colors duration-300'>
                                        <span className='material-icons'>more_horiz</span>
                                    </button>

                                    {showPopup && (

                                            <div className="absolute top-full left-0 bg-[#353535] rounded-xl py-2 px-1.5 z-10 w-fit gap-1.5 flex flex-col">
                                                <button className="w-full flex flex-row items-center cursor-pointer rounded-lg text-white hover:bg-white/10 text-sm gap-2 px-3 py-1.75"
                                                    onClick={() => {
                                                        setShareOpen(true);
                                                    }}
                                                >
                                                    <span className="material-symbols-outlined"
                                                        style={{
                                                            fontSize: 20,
                                                        }}
                                                    >
                                                        ios_share
                                                    </span>
                                                    <span>Share</span>
                                                </button>
                                                <button className="w-full flex flex-row items-center cursor-pointer rounded-lg text-red-400 hover:bg-red-500/10 text-sm gap-2 px-3 py-1.75"
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
                
                
                <a href="/user">

                    <Image
                    src={sessionObj?.user?.image || ''}
                    alt="User Profile"
                    width={35}
                    height={35}
                    className="rounded-full"
                    />
                </a>
                

            </div>
            )}
            <div className='h-full w-full p-4 pb-0 flex flex-col max-w-[700px] mx-auto '
                style={{
justifyContent: chatDisplay.length === 0 && !chatId ? "center" : "initial",
alignItems: chatDisplay.length === 0 && !chatId ? "center" : "initial"
                }}
            >
                {chatDisplay.length === 0 && !chatId ? (
                <>
                    <div className=' deskver:flex hidden flex-col mb-10 items-center justify-center text-4xl text-center'>
                        <span className='text-[#999a9d]'>Good to See You!</span>
                        <span className='bg-gradient-to-r bg-clip-text text-transparent from-[#b2b2b4] via-[white] to-[#b2b2b4]'>Your perfect trip starts here.</span>
                    </div>
                    <div className='deskver:hidden flex flex-col w-full h-full mb-20 items-center justify-center'>
                        <span className='text-3xl'>Triply.today</span>

                    </div>
                </>
                ) : (
                <div className="space-y-2 mb-[calc(15px+100px)] flex flex-col gap-2" ref={chatLogs}>
                    {chatDisplay.map((msg, index) => (
                        <div key={index} className='w-fit' style={{
                            maxWidth: msg.sender === "user" ? "500px" : "intial",
                            backgroundColor: msg.sender === "user" ? "#444" : isResponseBeingGenerated && index === chatDisplay.length - 1 ? "#2f2f2f" : "initial",
                            animation: msg.sender !== "user" && isResponseBeingGenerated && index === chatDisplay.length - 1 ? "pulse 5s infinite" : "none",
                            borderRadius: "30px",
                            padding: "10px 15px",
                            marginLeft: msg.sender === "user" ? "auto" : "0",
                        }}>
                            <div 
                            style={{
                            }}
                            className='[&>p:nth-last-of-type(1)]:inline'>    
                            <ReactMarkdown>
                                {msg.msg}
                            </ReactMarkdown>
                            
                            {msg.sender !== "user" && (
                                <span
                                    className="inline-block align-middle animate-blink"
                                    style={{
                                        display: msg.sender === "user" ? "none" : isResponseBeingGenerated && index === chatDisplay.length - 1 ? "inline-block" : "none",
                                        marginLeft: "3px",
                                        borderRadius: "2px",
                                        width: "8px",
                                        height: "18px",
                                        background: isResponseBeingGenerated && index === chatDisplay.length - 1
                                            ? "linear-gradient(135deg, #fff 60%, #b2b2b4 100%)"
                                            : "#e0e0e0",
                                        opacity: isResponseBeingGenerated && index === chatDisplay.length - 1 ? 1 : 0.7,
                                        boxShadow: isResponseBeingGenerated && index === chatDisplay.length - 1
                                            ? "0 0 8px 2px #fff8"
                                            : "none",
                                        transition: "background 0.3s, box-shadow 0.3s, opacity 0.3s",
                                    }}
                                ></span>
                            )}
                            </div>
                            <style jsx>{`
                                @keyframes blink {
                                    0%, 100% { opacity: 1; }
                                    50% { opacity: 0.3; }
                                }
                                .animate-blink {
                                    animation: blink 1s infinite;
                                }
                            `}</style>
                        </div>
                    ))}
                </div>
                )}
                {share && (
                    <>

                    <div className='w-full deskver:block hidden rounded-3xl bg-[#303030] p-4'
                        style={{
                            position: chatDisplay.length === 0 && !chatId ? "initial": "sticky",
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
                    <div className='w-full deskver:hidden block rounded-3xl bg-[#303030] p-4  '
                        style={{
                            position: "sticky",
                            bottom: "15px",
                            marginTop: "auto",
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
                    </>
                )}

            </div>
        </div>

    </div>
    </>
  )
}

export default ChatPage