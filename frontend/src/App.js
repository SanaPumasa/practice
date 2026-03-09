import ChatBox from './components/ChatBox/ChatBoxSimple';

const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '20px',
    gap: '16px',
    background: '#696969',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    padding: '10px 0',
  },
  title: {
    margin: 0,
    fontSize: '2.5rem',
    fontWeight: 700,
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '1rem',
    opacity: 0.9,
  },
};

function App() {
  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <h1 style={styles.title}>ChatBox</h1>
        <p style={styles.subtitle}>Your AI-powered assistant</p>
      </header>
      <ChatBox />
    </div>
  );
}

export default App;
