import {useDeferredValue, useState} from 'react';
import {Alert, Box, CircularProgress, Paper, TextField} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {searchBooks, searchBooksBySubject} from '../api/openLibraryApi';
import {BookSummary} from '../types/bookTypes';
import BookCard from './BookCard';

type Props = {
    query?: string;
    subject?: string;
    page?: number;
    limit?: number;
};

const BookList = ({query = 'javascript', subject, page = 1, limit = 20}: Props) => {
    const [titleFilter, setTitleFilter] = useState('');
    const deferredTitleFilter = useDeferredValue(titleFilter);
    const queryKey = subject
        ? ['books', 'subject', subject, page, limit]
        : ['books', 'search', query, page, limit];

    const {data, isLoading, isError, error} = useQuery({
        queryKey,
        queryFn: () => subject
            ? searchBooksBySubject(subject, page, limit)
            : searchBooks(query, page, limit),
    });

    const books: BookSummary[] = data?.docs ?? [];

    const normalizedFilter = deferredTitleFilter.trim().toLowerCase();
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(normalizedFilter)
    );

    if (isLoading) return <CircularProgress/>;
    if (isError) return <Alert severity="error">{String(error)}</Alert>;

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
