import { UserProvider } from './utils/userContext';
import MainApp from './App';

export default function AppWrapper() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}
