import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="flex overflow-auto flex-col justify-start items-center p-4 m-0 w-screen h-screen antialiased md:p-0 bg-zinc-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
