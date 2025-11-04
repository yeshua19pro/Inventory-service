export default async function Home() {
    const baseUrl = process.env.API_URL;
    const res = await fetch(`${baseUrl}/health`, { cache: "no-store" });
    const data = await res.json();

  return (
    <main>
      <h1>FastAPI conectado</h1>
      <p>Estado: {data.status}</p>
      <p>Versión: {data.version}</p>
        <p>IP:{data.client_ip}</p>
    </main>
  );
}
