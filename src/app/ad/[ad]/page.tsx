import { redirect } from "next/navigation";

export default function AdPage({ params }: { params: { ad: string } }) {
  const { ad: id } = params;
  const url = `https://www.blinkify.fun/ad/${id}`;
  const cluster =
    process.env.NEXT_PUBLIC_NETWORK === "devnet" ? "?cluster=devnet" : "";
  redirect(`https://dial.to?action=${url}${cluster}`);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Redirecting...
    </main>
  );
}
