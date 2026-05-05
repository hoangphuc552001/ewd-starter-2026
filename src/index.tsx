import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Box, Container} from '@mui/material';
import SiteHeader from './components/SiteHeader';
import HomePage from './pages/HomePage';
import BookDetailsPage from './pages/BookDetailsPage';
import ScienceFictionPage from './pages/ScienceFictionPage';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3600000,
            refetchInterval: 3600000,
            refetchOnWindowFocus: false,
        },
    },
});

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Box sx={{minHeight: '100vh', bgcolor: 'background.default'}}>
                    <SiteHeader/>
                    <Container component="main" sx={{py: 4}}>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/science-fiction" element={<ScienceFictionPage/>}/>
                            <Route path="/books/:id" element={<BookDetailsPage/>}/>
                        </Routes>
                    </Container>
                </Box>
            </BrowserRouter>
        </QueryClientProvider>
    )

}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <App/>
);
