import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import logo from '../assets/images/logo.jpg';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

function Navbar() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get('/users/me');
        setUserData(response.data.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    getUserData();
  }, []);

  if (loading) return <div>Loading</div>;

  if (error) {
    switch (error?.response?.status) {
      case 401:
        setError(null);
        setUserData(null);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <AppBar
        position='static'
        sx={{
          background: '#7400B8',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingX: '0%',
            }}
          >
            <Link to='/'>
              <img
                src={logo}
                alt='logo'
                width='50%'
              />
            </Link>

            {userData === null ? (
              <Stack
                direction='row'
                spacing={2}
              >
                <Link to='/login'>
                  <Button
                    variant='contained'
                    color='secondary'
                    transform={-1}
                  >
                    LogIn
                  </Button>
                </Link>
                <Link to='/signup'>
                  <Button
                    variant='contained'
                    color='primary'
                    transform={-1}
                    sx={{ boxShadow: 'none' }}
                  >
                    SignUp
                  </Button>
                </Link>
              </Stack>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {/* <Avatar
                  sx={{ bgcolor: 'pink', color: 'black'}}
                  alt={userData.name.toUpperCase()}
                  src='/broken-image.jpg'
                ></Avatar> */}
                <IconButton
                  id='basic-button'
                  color='secondary'
                  onClick={handleClick}
                >
                  <MenuOutlinedIcon fontSize='large' />
                </IconButton>
                <Menu
                  id='basic-menu'
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem
                    sx={{
                      '&:hover': {
                        backgroundColor: 'inherit',
                        cursor: 'default',
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{ bgcolor: 'pink', color: 'black' }}
                        alt={userData.name.toUpperCase()}
                        src='/broken-image.jpg'
                      ></Avatar>
                    </ListItemIcon>
                    <ListItemText sx={{ marginLeft: '0.5em' }}>
                      <Typography>{userData.name}</Typography>
                    </ListItemText>

                    <ListItemIcon
                      sx={{
                        marginLeft: '5em',
                        '&:hover': {
                          backgroundColor: 'inherit',
                          cursor: 'pointer',
                        },
                      }}
                      onClick={handleClose}
                    >
                      <CloseOutlinedIcon fontSize='large' />
                    </ListItemIcon>
                  </MenuItem>

                  <Divider />

                  <MenuItem>
                    <ListItemIcon>
                      <AccountBoxOutlinedIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      navigate(`/u/${userData?.name}`);
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <FolderOutlinedIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={async() => {
                      await axios.post(`/users/logout`);
                      document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                      navigate('/login');
                      handleClose();
                    }}
                  >
                    <ListItemIcon>
                      <LogoutOutlinedIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
}

export default Navbar;
