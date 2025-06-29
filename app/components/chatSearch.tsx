"use client";
import React, { useEffect, useRef, useState } from 'react'
interface Conversation {
  chatId: string;
  name: string;
}
interface ChatSearchProps {
  onClose: () => void;
  conversations?: Conversation[];
  chnageConversation: (chatId: string) => void;
}

const ChatSearch = ({onClose, conversations, chnageConversation}:ChatSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  useEffect(() => {
  const convs = conversations?.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).splice(0, 5);
  if (searchQuery === "") {
    setFilteredConversations([]);
    return;
  }
  setFilteredConversations(convs || []);
  }, [searchQuery, conversations]);

  const searchRef = useRef<HTMLInputElement>(null)

  
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  return (
    <div className='absolute top-0 left-0 w-full h-full font-[Poppins] z-50 flex items-center justify-center'>
        <div className='backdrop-blur-xl text-white bg-[#2f2f2f] w-[50%] min-w-[500px] max-w-[700px] rounded-3xl '>
            <div className='py-3 px-6 border-b-1 border-[#4f4f4f] flex flex-row items-center'>
              <input type="text" 
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              ref={searchRef}
              style={{
                caretColor: "#bcbcbc",
              }}
              className='outline-0 w-full' placeholder='Search Chats'/>
              <button 
              onClick={() =>{
                setSearchQuery("");
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
            <div className='overflow-y-auto h-70'
            style={{
              scrollbarColor: "#4f4f4f transparent",
              scrollbarWidth: "thin",
            }}
            >
              {filteredConversations.length > 0 ? (
                <div className='flex flex-col gap-2 p-4'>
                  {filteredConversations.map((conv, index) => (
                    <button key={index}
                      onClick={() => {

                        chnageConversation(conv.chatId);
                        onClose();

                      }}
                      className='w-full text-left p-3 cursor-pointer hover:bg-[#4f4f4f] transition-colors duration-200 rounded-xl flex flex-row gap-3 items-center'
                    >
                      <span className="material-symbols-outlined"
                        style={{
                          fontSize: 20,
                        }}
                      >
                      chat_bubble
                      </span>
                      <span>{conv.name}</span>
                    </button>
                  ))}
                </div>
              ) : searchQuery !== "" ? (
                
                <div className='p-4 text-center text-gray-400 h-full w-full flex items-center justify-center'>No Chats found</div>
              ) :(
                <div className='p-4 text-center text-gray-400'></div>
              )}
            </div>

        </div>
    </div>
  )
}

export default ChatSearch