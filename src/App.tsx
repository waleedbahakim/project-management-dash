import { Router } from '@/router';
import '@/index.css';
import ThemeProvider from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}

export default App;
