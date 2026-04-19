import "./globals.css";

export const metadata = {
  title: "Escape the Professor's Study 🔐",
  description: "A collaborative escape room for classrooms",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-stone-950 text-stone-100">{children}</body>
    </html>
  );
}
