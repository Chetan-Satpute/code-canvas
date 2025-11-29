import AppRouter from '#components/AppRouter.tsx';
import QueryClientProvider from '#components/QueryClientProvider.tsx';
import ReduxProvider from '#redux/ReduxProvider.tsx';

function App() {
  return (
    <ReduxProvider>
      <QueryClientProvider>
        <AppRouter />
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
