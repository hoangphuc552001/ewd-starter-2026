import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Paper } from '@mui/material';
import { searchBooks, searchBooksBySubject } from '../api/openLibraryApi';
import { BookSummary, SearchResult } from '../types/bookTypes';
import BookCard from './BookCard';

type Props = {
  query?: string;
  subject?: string;
  page?: number;
  limit?: number;
};

const BookList = ({ query = 'javascript', subject, page = 1, limit = 20 }: Props) => {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    let request: Promise<SearchResult>;
    if (subject){
        request = searchBooksBySubject(subject, page, limit);
    }else{
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

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper sx={{ p: 2 }}>
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
        {books.map((b) => (
          <Box key={b.key} sx={{ minWidth: 0 }}>
            <BookCard book={b} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default BookList;
