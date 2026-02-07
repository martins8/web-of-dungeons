function Title() {
  return <h1>Web of Dungeons!</h1>;
}

function Text() {
  return (
    <p>
      Olá, aventureiro, Web of Dungeons, será um TEXT BASED RPG open source.
      Minha intenção com esse projeto é aprimorar minhas habilidades com a Stack
      Next/React/JS/CSS
    </p>
  );
}

export default function Home() {
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Title />
      <Text />
    </div>
  );
}
