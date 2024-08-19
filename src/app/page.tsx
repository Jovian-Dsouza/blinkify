import { redirect } from "next/navigation";

export default function Home() {
  redirect(`/dashboard`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Redirecting...
    </main>
  );
}
