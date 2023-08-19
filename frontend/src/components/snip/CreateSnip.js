import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Zoom,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

function CreateSnip({ snipData }) {
  const [title, setTitle] = useState(snipData ? snipData.title : '');
  const [content, setContent] = useState(snipData ? snipData.content : '');
  const [category, setCategory] = useState(snipData ? snipData.category : '');
  const [privacy, setPrivacy] = useState(snipData ? snipData.scope : 'public');
  const [expiresAt, setExpiresAt] = useState(
    snipData ? dayjs(snipData.expiresAt) : null
  );
  const [tags, setTags] = useState(snipData ? snipData.tags : []);
  const [tagValue, setTagValue] = useState('');
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [showPrivate, setShowPrivate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState();
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [feedback, setFeedback] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get('/users/me');
        setUserId(response.data.data._id);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleTagDelete = (tagToDelete) => () => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleTagKeyUp = (e) => {
    const val = tagValue.trim();
    if (e.key === 'Enter' && val !== '' && !tags.includes(val)) {
      setTags([...tags, val]);
      setTagValue('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const snip = {
      title: title.trim(),
      content,
      category,
      scope: privacy,
      expiresAt,
      tags,
      userId,
    };

    if(!snipData)
      snip[password] = isProtected ? password : null;

    if (title === '') setTitleError(true);

    if (content === '') setContentError(true);

    if (title === '' || content === '') return;

    let response;
    if(snipData)
      response = await axios.patch(`/pastes/${snipData._id}`, snip);
    else
      response = await axios.post('/pastes', snip);

    setFeedback(true);
    const pasteId = response.data.data.paste._id;

    setTimeout(() => {
      navigate(`/${pasteId}`);
    }, 1000);
  };

  if (loading) return <div>Loading</div>;

  if (error) {
    switch (error?.response?.status) {
      case 401:
        setShowPrivate(false);
        setUserId(null);
        setError(null);
        break;
      default:
        return <div>Something went wrong</div>;
    }
    return <div>error</div>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Container sx={{ paddingY: '2%' }}>
          <Typography
            variant='h4'
            marginBottom='2%'
          >
            {snipData ? 'Update snip' : 'Create Snip'}
          </Typography>
          <form>
            <Stack spacing={4}>
              <TextField
                label='Title'
                value={title}
                error={titleError}
                helperText={titleError ? 'Title is required' : ''}
                onChange={(e) => {
                  if (titleError) {
                    setTitleError(false);
                  }
                  setTitle(e.target.value);
                }}
              />
              <TextField
                label='Content'
                value={content}
                error={contentError}
                helperText={contentError ? '*Content is required' : ''}
                onChange={(e) => {
                  if (contentError) {
                    setContentError(false);
                  }
                  setContent(e.target.value);
                }}
                multiline
                minRows={10}
              ></TextField>

              <Autocomplete
                options={categories}
                inputValue={category}
                onInputChange={(event, newInputValue) => {
                  setCategory(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Category'
                  />
                )}
              ></Autocomplete>

              <FormControl>
                <InputLabel id='demo-simple-select-label'>Privacy</InputLabel>
                <Select
                  value={privacy}
                  labelId='demo-simple-select-label'
                  label='Privacy'
                  onChange={(e) => setPrivacy(e.target.value)}
                >
                  {privacies.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      disabled={option === 'private' && !showPrivate}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DateTimePicker
                label='Snip Expiration'
                value={expiresAt}
                onChange={(newValue) => setExpiresAt(newValue)}
                viewRenderers={{
                  hours: renderTimeViewClock,
                }}
                views={['year', 'month', 'day', 'hours']}
              />

              <TextField
                label='Tags'
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value.trim())}
                onKeyUp={handleTagKeyUp}
                multiline
                disabled={tags.length === 3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      {tags.map((tag, index) => {
                        return (
                          <ListItem key={index}>
                            <Chip
                              label={tag}
                              onDelete={handleTagDelete(tag)}
                            />
                          </ListItem>
                        );
                      })}
                    </InputAdornment>
                  ),
                  endAdornment: <div>{`${tags.length}/3`}</div>,
                }}
              />

              {!snipData && (
                <>
                  <FormControlLabel
                    checked={isProtected}
                    onChange={(e) => {
                      setIsProtected(e.target.checked);
                      setPassword('');
                    }}
                    control={<Checkbox />}
                    label='Password protected'
                    labelPlacement='end'
                  />

                  <TextField
                    label='password'
                    value={password}
                    disabled={!isProtected}
                    onChange={(e) => setPassword(e.target.value)}
                  ></TextField>
                </>
              )}

              <Button
                variant='contained'
                color='primary'
                type='submit'
                onClick={handleSubmit}
                sx={{
                  width: 'fit-content',
                  align: 'center',
                }}
              >
                {snipData ? 'Update' : 'Submit'}
              </Button>
            </Stack>
          </form>
        </Container>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={feedback}
        autoHideDuration={2000}
        onClose={() => setFeedback(false)}
        TransitionComponent={Zoom}
      >
        <Alert
          variant='standard'
          severity='success'
          sx={{ width: '100%' }}
        >
          {snipData ? 'Snip updated successful' : 'Snip created successful'}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
}

export default CreateSnip;

const categories = [
  'Personal',
  'Work',
  'Study',
  'Ideas',
  'Shopping',
  'To-Do',
  'Recipes',
  'Travel',
  'Health',
  'Finance',
  'Meetings',
  'Goals',
];

const privacies = ['unlisted', 'public', 'private'];
