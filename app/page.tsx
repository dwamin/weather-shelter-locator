export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#0070f3' }}>
        안녕하세요! 👋
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>
        Azure Static Web Apps 배포에 성공했습니다.
      </p>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px 20px', 
        background: '#f0f0f0', 
        borderRadius: '8px' 
      }}>
        현재 시간: {new Date().toLocaleTimeString('ko-KR')}
      </div>
    </main>
  );
}
