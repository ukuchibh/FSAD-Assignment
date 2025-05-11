import LoginDialog from "@/components/LoginDialog";
import RegisterDialog from "@/components/RegisterDialog";

export default function LoginPage() {
  return (
    <main className="flex flex-col gap-10 justify-center items-center w-full h-full md:flex-row">
      <LoginDialog />
      <p className="text-2xl font-bold select-none">(or)</p>
      <RegisterDialog />
    </main>
  );
}
