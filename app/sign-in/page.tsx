import { SignInButton } from "@clerk/nextjs";
import { LogIn } from "lucide-react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SignInButton forceRedirectUrl="/drive">
        <button
          className=" px-6 py-3 font-semibold text-sm rounded-lg transition-all duration-200 ease-in-out
          flex items-center gap-2 min-w-[120px] justify-center bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-400"
        >
          <>
            <LogIn className="w-4 h-4" />
            Sign In
          </>
        </button>
      </SignInButton>
      <footer className="mt-16 text-sm text-neutral-500">
        © {new Date().getFullYear()}Drive. All rights reserved.
      </footer>
    </div>
  );
}
