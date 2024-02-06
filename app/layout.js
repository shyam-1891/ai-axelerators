import "./globals.css";
export const metadata = {
  title: "Ai-axelerators",
  description:
    "This will help you to generate Ai based caption for your image."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
