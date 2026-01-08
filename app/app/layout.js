import "./globals.css";

export const metadata = {
  title: "Long Beach Dashboard",
  description: "Fog, wind, rain forecast for port operations"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
