import { Button } from "@/components/ui/button";
import { Cloud } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-7 h-7 text-black" />
              <h1 className="text-xl font-bold text-black">Drive</h1>
            </div>
            <div className="flex items-center gap-4">
              <SignInButton forceRedirectUrl="/drive">
                <button className="text-black hover:bg-gray-100 font-medium px-4 py-2 rounded transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton forceRedirectUrl="/drive">
                <button className="bg-black text-white hover:bg-gray-800 font-medium px-6 py-2 rounded transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto pt-32 pb-20">
          <h2 className="text-6xl font-bold text-black mb-8 leading-tight">
            Your files,
            <br />
            simplified.
          </h2>
          <p className="text-xl text-gray-600 mb-16 leading-relaxed">
            Place to store your files and folders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <form
              action={async () => {
                "use server";

                const session = await auth();

                if (!session.userId) {
                  return redirect("/sign-in");
                }

                return redirect("/drive");
              }}
            >
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-medium"
              >
                Get Started
              </Button>
            </form>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 text-lg font-medium bg-transparent transition-colors"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
