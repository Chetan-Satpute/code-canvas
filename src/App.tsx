import AppRouter from '#components/AppRouter.tsx';
import PlayContextProvider from '#components/PlayContextProvider.tsx';
import QueryClientProvider from '#components/QueryClientProvider.tsx';
import ReduxProvider from '#redux/ReduxProvider.tsx';

function App() {
  return (
    <ReduxProvider>
      <QueryClientProvider>
        <PlayContextProvider>
          <AppRouter />
        </PlayContextProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

export default App;
