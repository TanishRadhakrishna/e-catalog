// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "E-Catalog",
  description: "Simple e-catalog with reporting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
