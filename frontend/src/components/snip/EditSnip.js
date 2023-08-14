import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { useState, useEffect } from 'react';
import CreateSnip from './CreateSnip';

function EditSnip() {
  const [snipData, setSnipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const [open, setOpen] = useState(true);
  const [password, setPassword] = useState('');

  const { snipId } = useParams();

  const handleDialogSubmit = async () => {
    await getSnipData();
    setPassword('');
  };

  async function getSnipData() {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/pastes/${snipId}`,
        { password }
      );

      if (response.data.data.isEditable === false)
        throw new Error('Not editable');

      setOpen(false);
      setIsProtected(false);
      setSnipData(response.data.data);
    } catch (error) {
      if (error?.response?.data?.message === 'Incorrect paste password') {
        setIsProtected(true);
      } else {
        if (error.message) {
          error['response'] = {status: 401};
        }
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
    return (
      <>
        <CreateSnip snipData={snipData} />
      </>
    );
  }
}

export default EditSnip;
