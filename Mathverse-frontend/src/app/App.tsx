import { UserProvider } from './utils/userContext';
import MainApp from './NewApp';

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
