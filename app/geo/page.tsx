export default function GeoPage() {
  return (
    <main style={{ width: '100vw', height: '100vh', padding: 0, margin: 0, overflow: 'hidden' }}>
      <iframe 
        src="/geo/god-shinobi.html" 
        style={{ width: '100%', height: 'calc(100vh - 75px)', border: 'none', backgroundColor: '#09090b' }} 
        title="Gorilla Geo — God Shinobi"
      />
    </main>
  );
}
