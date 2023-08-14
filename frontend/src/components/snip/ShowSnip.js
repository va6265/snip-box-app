import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { useState, useEffect } from 'react';
import Feedback from '../Feedback';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

function ShowSnip() {
  const [snipData, setSnipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({});
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [likeDislikeCount, setLikeDislikeCount] = useState();

  const { snipId } = useParams();
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    await axios.delete(`http://127.0.0.1:8000/api/pastes/${snipId}`);
    setFeedback('Snip deleted successfully');
    setFeedbackOpen(true);
    setTimeout(() => navigate(-1), 1000);
  };

  const handleLikeClick = async (event) => {
    if (!snipData.isLikeable) {
      setFeedback({ text: 'Please login to like', type: 'error' });
      setFeedbackOpen(true);
      return;
    }

    await axios.patch(`http://127.0.0.1:8000/api/pastes/${snipId}/like`);
    setOpen(true);
    setIsProtected(true);
    getSnipData();
  };

  const handleDislikeClick = async (event) => {
    if (!snipData.isLikeable) {
      setFeedback({ text: 'Please login to dislike', type: 'error' });
      setFeedbackOpen(true);
      return;
    }

    await axios.patch(`http://127.0.0.1:8000/api/pastes/${snipId}/dislike`);
    setOpen(true);
    setIsProtected(true);
    getSnipData();
  };

  const handleDialogSubmit = async () => {
    await getSnipData();
    setPassword('');
  };

  async function getSnipData() {
    try {
      const count = await axios.get(
        `http://127.0.0.1:8000/api/pastes/${snipId}/likeDislikeCount`
      );

      const response = await axios.post(
        `http://127.0.0.1:8000/api/pastes/${snipId}`,
        { password }
      );

      console.log(response);
      setOpen(false);
      setIsProtected(false);
      setSnipData(response.data.data);
      setLikeDislikeCount(count.data.data);
    } catch (error) {
      if (error.response.data.message === 'Incorrect paste password') {
        setIsProtected(true);
      } else {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSnipData();
  }, []);

  if (loading) return <div>loading</div>;

  if (error) {
    switch (error.response.status) {
      case 401:
        return <div>Unauthorized</div>;
      case 404:
        return <div>Not found</div>;
      default:
        return <div>Something went wrong try again</div>;
    }
  }

  if (isProtected) {
    return (
      <div>
        <Dialog open={open}>
          <DialogTitle>Enter password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label='Password'
              type='password'
              fullWidth
              variant='standard'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  if (snipData) {
    snipData.createdAt = new Date(snipData.createdAt);
    return (
      <>
        <Container sx={{ paddingY: '3%', boxShadow: 'none' }}>
          <Paper elevation={2}>
            <Card
              sx={{ boxShadow: 'none', border: '1px solid rgba(0,0,0,0.2)' }}
            >
              <CardHeader
                action={
                  <Stack
                    direction='row'
                    spacing={1}
                  >
                    {snipData.isEditable && (
                      <>
                        <Button
                          variant='contained'
                          sx={{
                            borderRadius: '10px',
                          }}
                          onClick={() => {
                            navigate(`/edit/${snipId}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant='contained'
                          sx={{
                            borderRadius: '10px',
                          }}
                          onClick={handleDeleteClick}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    <Button
                      variant='contained'
                      sx={{
                        borderRadius: '10px',
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(snipData.content);
                        setFeedback({
                          text: 'Copied to clipboard',
                          type: 'success',
                        });
                        setFeedbackOpen(true);
                      }}
                    >
                      Copy
                    </Button>
                    <Button
                      variant='contained'
                      sx={{
                        borderRadius: '10px',
                      }}
                      onClickCapture={() => {
                        download(snipData.title, snipData.content);
                        setFeedback({ text: 'Downloaded', type: 'success' });
                        setFeedbackOpen(true);
                      }}
                    >
                      Download
                    </Button>
                  </Stack>
                }
                title={snipData.title}
                subheader={`${months[snipData.createdAt.getMonth()]}\
                          ${snipData.createdAt.getDate()},\
                          ${snipData.createdAt.getFullYear()}`}
              />
              <Divider
                sx={{
                  backgroundColor: 'rgba(0,0,0,0.2)',
                  width: '90%',
                  marginX: 'auto',
                }}
              />
              <CardContent>
                <TextField
                  value={snipData.content}
                  multiline
                  fullWidth
                />
              </CardContent>
              <CardActions>
                <IconButton
                  color='primary'
                  onClick={handleLikeClick}
                >
                  {snipData.likedByUser ? (
                    <ThumbUpAltIcon />
                  ) : (
                    <ThumbUpOffAltIcon />
                  )}
                  <Typography
                    variant='h5'
                    component='p'
                    sx={{ marginLeft: '5px' }}
                  >
                    {likeDislikeCount.likesCount}
                  </Typography>
                </IconButton>

                <IconButton
                  color='primary'
                  onClick={handleDislikeClick}
                >
                  {snipData.dislikedByUser ? (
                    <ThumbDownAltIcon />
                  ) : (
                    <ThumbDownOffAltIcon />
                  )}
                  <Typography
                    variant='h5'
                    component='p'
                    sx={{ marginLeft: '5px' }}
                  >
                    {likeDislikeCount.dislikesCount}
                  </Typography>
                </IconButton>

              </CardActions>
            </Card>
          </Paper>
        </Container>
        {feedbackOpen && (
          <Feedback
            message={feedback}
            open={feedbackOpen}
            setOpen={setFeedbackOpen}
          />
        )}
      </>
    );
  }
}

export default ShowSnip;

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const download = (title, content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${title}.txt`;
  link.href = url;
  link.click();
};
