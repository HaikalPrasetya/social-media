import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginImage from "@/assets/login-image.jpg";
import LoginForm from "./LoginForm";
import GoogleSignInButton from "./GoogleSignInButton";

export const metadata: Metadata = {
  title: "Login",
};

function LoginPage() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Login Funsos</h1>
            <p className="text-muted-foreground">
              Tempat dimana <span className="italic">anda</span> dapat mencari
              teman baru.
            </p>
          </div>
          <div className="space-y-5">
            <GoogleSignInButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-muted" />
              <span>OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>
            <LoginForm />
            <Link href="/signup" className="block text-center hover:underline">
              Belum memiliki akun? Register
            </Link>
          </div>
        </div>
        <Image
          src={LoginImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}

export default LoginPage;
