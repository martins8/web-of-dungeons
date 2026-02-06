import "../styles/globals.css";

export const metadata = {
  title: "Web of Dungeons",
  description: "Um RPG dungeon dark baseado na web",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            whiteSpace: "nowrap",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
