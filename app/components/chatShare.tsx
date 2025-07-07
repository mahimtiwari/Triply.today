"use client";
import React, { useEffect, useRef, useState } from 'react'
enum Visibility {
    PRIVATE = "PRIVATE",
    GLOBAL = "GLOBAL",
}
interface ChatShareProps {
  onClose: () => void;
  chatID?: string;
  visibility?: string;
  changeVisibility: (newVis: Visibility) => void;
}

const ChatShare = ({onClose, chatID, visibility, changeVisibility}:ChatShareProps) => {

    const shareSelected = visibility || "";
    const shareRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if(shareSelected !== ""){
            
            fetch('/api/conversation/share', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    conversationId: chatID,
                    visibility: shareSelected as Visibility,
                }),
            });
        }
    }, [shareSelected]);

  return (
    <div className='absolute top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center'>
        <div 
        
        className='backdrop-blur-xl font-[Poppins] text-white bg-[#2f2f2f] p-5 w-[50%] min-w-[500px] max-w-[700px] rounded-3xl '>

            <div className='flex flex-row items-center justify-between'>
                <span className='text-lg'>Share Your Chat</span>
                <button 
                onClick={() =>{
                    onClose();

                }}
                className='ml-2 hover:bg-[#4f4f4f] cursor-pointer flex flex-col items-center justify-center p-2 rounded-xl'>
                    <span className="material-symbols-outlined text-[#bcbcbc]"
                    style={{
                    fontSize: 20
                    }}
                    >
                    close
                    </span>
                </button>
            </div>
            <div className='mt-4 flex flex-col gap-4'>

            <button 
            onClick={() => changeVisibility(Visibility.PRIVATE)}
            style={{
                border: shareSelected === "PRIVATE" ? "1px solid rgb(0 111 172 / 34%)" : "1px solid transparent",
                backgroundColor: shareSelected === "PRIVATE" ? "rgb(0 111 172 / 10%)" : "",
                transition: "all 0.15s ease-in-out"
                
            }}
            className='flex flex-row w-full bg-[#444] px-6 py-6 rounded-xl cursor-pointer'>
                <div className='flex flex-col items-start'>
                    <span className='text-lg leading-tight'>Private</span>
                    <span className='text-sm leading-tight text-[#c6c6c6]'>Only you can access this Chat</span>
                </div>

            </button>
            <button 
            style={{
                border: shareSelected === "GLOBAL" ? "1px solid rgb(0 111 172 / 34%)" : "1px solid transparent",
                backgroundColor: shareSelected === "GLOBAL" ? "rgb(0 111 172 / 10%)" : "",
                transition: "all 0.15s ease-in-out"
            }}
            onClick={() => changeVisibility(Visibility.GLOBAL)}
            className='flex flex-col w-full bg-[#444] px-6 py-6 rounded-xl cursor-pointer'>
                <div className='flex flex-col items-start'>
                <div className='flex flex-col items-start'>
                    <span className='text-lg leading-tight'>Global</span>
                    <span className='text-sm leading-tight text-[#c6c6c6]'>Anyone with the link can view this chat</span>
                </div>
                <div 
                style={{
                    backgroundColor: shareSelected === "GLOBAL" ? "#ffff" : "#999",
                    transition: "all 0.15s ease-in-out",
                    cursor: shareSelected === "GLOBAL" ? "pointer" : "",
                }}
                ref={shareRef}
                onClick={(e)=>{
                    if(shareSelected !== "GLOBAL") return;
                    navigator.clipboard.writeText(`${window.location.origin}/chat/share/${chatID}`);
                    if (shareRef.current) {
                        shareRef.current.style.backgroundColor = "#00afef";
                        shareRef.current.innerHTML = "Link Copied!";
                        setTimeout(() => {
                            if (shareRef.current) {
                                shareRef.current.style.backgroundColor = "#ffff";
                                shareRef.current.innerHTML = "Copy Link";
                            }
                        }, 500);
                    }
                    
                }}
                className='mt-6 font-semibold  w-full rounded-2xl bg-white text-black py-4'>
                    Copy Link
                </div>
                </div>
            </button>
            </div>
        </div>
    </div>
  )
}

export default ChatShare