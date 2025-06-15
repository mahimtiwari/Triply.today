
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SignInButtons from '@/app/components/SignInButtons';
import Header from '@/app/components/header';
export default async function SSRAuthPage() {
  const session = await getServerSession(authOptions);

  return (
    <>
    <Header />
<div className="flex justify-center items-center h-[80vh] font-[geist] bg-gradient-to-b from-white via-gray-100 to-white">
  <div className="w-[350px] bg-white border border-gray-200 h-80 rounded-3xl flex flex-col justify-center items-center gap-6 p-6">
    <div className="flex flex-col items-center text-gray-700 w-full mx-1">
      <span className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-4xl font-semibold text-gray-800">
        t
      </span>
      <span className="mt-4 text-[17px] font-semibold tracking-tight">Sign in with OAuth</span>

      <SignInButtons />
    </div>
  </div>
</div>

    </>
  );
}