import { Paper, Typography } from '@mui/material';
import BookList from '../components/BookList';

const ScienceFictionPage = () => {
  return (
    <>
        <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Open Library Books
            </Typography>
            <Typography variant="body1">
                SciFi books from Open Library Search API.
            </Typography>
        </Paper>


        <BookList subject="science_fiction" />
    </>
  );
};

export default ScienceFictionPage;
