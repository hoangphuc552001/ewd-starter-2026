import {useDeferredValue, useEffect, useState} from 'react';
import {Alert, Box, CircularProgress, Paper, TextField, Typography} from '@mui/material';
import {searchBooks, searchBooksBySubject} from '../api/openLibraryApi';
import {BookSummary, SearchResult} from '../types/bookTypes';
import BookCard from './BookCard';

type Props = {
    query?: string;
    subject?: string;
    page?: number;
    limit?: number;
};

const BookList = ({query = 'javascript', subject, page = 1, limit = 20}: Props) => {
    const [books, setBooks] = useState<BookSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [titleFilter, setTitleFilter] = useState('');
    const deferredTitleFilter = useDeferredValue(titleFilter);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError(null);

        let request: Promise<SearchResult>;
        if (subject) {
            request = searchBooksBySubject(subject, page, limit);
        } else {
            request = searchBooks(query, page, limit);
        }

        request
            .then((r) => {
                if (!mounted) return;
                setBooks(r.docs || []);
            })
            .catch((e) => {
                if (!mounted) return;
                setError(String(e));
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [query, subject, page, limit]);

    const normalizedFilter = deferredTitleFilter.trim().toLowerCase();
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(normalizedFilter)
    );

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Paper sx={{p: 3, mb: 3, mt: 3}}>
                <TextField
                    fullWidth
                    label="Filter by title"
                    value={titleFilter}
                    onChange={(event) => setTitleFilter(event.target.value)}
                />
            </Paper>

            <Paper sx={{p: 2}}>
                <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, minmax(0, 1fr))',
                            md: 'repeat(3, minmax(0, 1fr))',
                            lg: 'repeat(4, minmax(0, 1fr))',
                        },
                    }}
                >
                    {filteredBooks.map((b) => (
                        <Box key={b.key} sx={{minWidth: 0}}>
                            <BookCard book={b}/>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </>
    );
};

export default BookList;
