import React, { use, useEffect, useState } from 'react'

const Sharepopup = ({ id, open, val, shEmails, onClose }: { id: string, open:boolean, val: string, shEmails:string, onClose:() => void }) => {

    const [shareSelected, setShareSelected] = useState(val);
    const [shareSelectedEmails, setShareSelectedEmails] = useState<string>(shEmails);


    useEffect(() => {
        setShareSelected(val);
    }, [val]);
    useEffect(() => {
        setShareSelectedEmails(shEmails);
    }, [shEmails]);

    const doneBtnRef = React.useRef<HTMLButtonElement>(null);
    console.log("Sharepopup val", shareSelected, "val", val);
function share(){
    if (doneBtnRef.current) {
        doneBtnRef.current.disabled = true;
        doneBtnRef.current.innerHTML = "Sharing...";
    }
    fetch('/api/user/operations/plan/share', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            type: shareSelected,
            emails: shareSelectedEmails,
        }),
    }).then((res) => {
        if (res.ok) {
            onClose();
            return res.json();
        } else {
            alert('Failed to share the plan');
        }
    })
}

return (
    <>
    {open && (
    <div className='fixed inset-0 bg-black/30 bg-opacity-50 z-10000 flex items-center justify-center'
                onClick={(e) => {
                if (e.target === e.currentTarget) {
                        onClose();
                }
        }}
    >
        <div className='absolute top-1/2 font-[geist] left-1/2 bg-white w-[40%] max-w-[500px] min-w-[400px] z-1000 p-4 shadow-lg rounded-2xl m-4' 
        style={{ transform: 'translate(-50%, -50%)'}}>
                <div className='flex justify-between mb-2 flex-col'>
                        <span className='text-[23px] '>Share You Plan</span>
                        <div className='flex flex-col gap-2 my-2'>
                                <button className='flex w-full cursor-pointer h-16 border border-white rounded-2xl p-2 px-4 items-center gap-3 transition-all duration-200'
                                        style={{
                                                border: shareSelected === "PRIVATE" ? "1px solid rgb(0 111 172 / 34%)" : "",
                                                backgroundColor: shareSelected === "PRIVATE" ? "rgb(235 248 255 / 42%)" : "initial",
                                                
                                        }}
                                        onClick={() => setShareSelected("PRIVATE")}
                                >
                                        <span className='material-icons text-gray-600 '>lock</span>
                                        <div className='flex flex-col'>
                                            
                                                <span className='text-gray-800 font-medium text-left'>Private</span>
                                                <span className='text-gray-500 text-sm'>Only you can access this</span>
                                        </div>
                                </button>
                                <button className='flex w-full cursor-pointer h-16 border border-white rounded-2xl p-2 px-4 items-center gap-3  transition-all duration-200'
                                        style={{
                                                border: shareSelected === "SHARED" ? "1px solid rgb(0 111 172 / 34%)" : "",
                                                backgroundColor: shareSelected === "SHARED" ? "rgb(235 248 255 / 42%)" : "transparent",
                                        }}
                                        onClick={() => setShareSelected("SHARED")}
                                >
                                        <span className='material-icons text-gray-600 '>group</span>
                                        <div className='flex flex-col'>
                                                <span className='text-gray-800 font-medium text-left'>Shared</span>
                                                <span className='text-gray-500 text-sm'>Visible only to selected individuals</span>
                                        </div>
                                </button>
                                <button className='flex w-full cursor-pointer h-16 border-1 border-white rounded-2xl p-2 px-4 items-center gap-3  transition-all duration-200'
                                        style={{
                                                border: shareSelected === "PUBLIC" ? "1px solid rgb(0 111 172 / 34%)" : "",
                                                backgroundColor: shareSelected === "PUBLIC" ? "rgb(235 248 255 / 42%)" : "transparent",
                                        }}
                                        onClick={() => setShareSelected("PUBLIC")}
                                >
                                        <span className='material-icons text-gray-600 '>public</span>
                                        <div className='flex flex-col'>
                                                <span className='text-gray-800 font-medium text-left'>Public</span>
                                                <span className='text-gray-500 text-sm'>Anyone with the link can access this</span>
                                        </div>
                                </button>

                        </div>
                        {shareSelected === "SHARED" && (
                        <div className='flex flex-col gap-2'>
                                <span className='text-gray-600 text-sm'>Share with specific people</span>
                                <input 
                                        type="text" 
                                        placeholder='Enter emails separated by commas'
                                        value={shareSelectedEmails}
                                        onChange={(e) => {
                                                setShareSelectedEmails(e.target.value.trim());
                                                const emails = e.target.value.trim();
                                                setShareSelectedEmails(emails);
                                        }}
                                        className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                        </div>
                        )}
                </div>
                <div className='font-medium flex flex-row items-center justify-between mb-2'>
                        <button 
                        onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                        }}
                        className='text-[#1e64d4] outline-0 border flex flex-row items-center gap-2 border-gray-400 cursor-pointer px-4 py-2 rounded-3xl hover:bg-blue-50 transition duration-300'>
                                <span className='material-icons'>link</span>
                                Copy Link
                        </button>
                        <button 
                        ref={doneBtnRef}
                        onClick={() => {
                            share();
                        }}
                        className='bg-[#1e64d4] w-[100px] outline-0 cursor-pointer text-white px-4 py-2 rounded-3xl hover:bg-blue-600 transition duration-400'>
                                Done
                        </button>
                </div>
        </div>
    </div>
    )}
    </>
)
}

export default Sharepopup