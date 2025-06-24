import React from 'react';

const ChatPage = () => {
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
                <p>Welcome to the chat!</p>
            </main>
            <footer className="p-4 bg-gray-100 border-t border-gray-300">
                <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full p-2 rounded border border-gray-300"
                />
            </footer>
        </div>
        </div>

    );
};

export default ChatPage;