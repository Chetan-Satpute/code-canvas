import AppRouter from '#components/AppRouter.tsx';
import QueryClientProvider from '#components/QueryClientProvider.tsx';

function App() {
  return (
    <QueryClientProvider>
      <AppRouter />
    </QueryClientProvider>
  );
}

export default App;
