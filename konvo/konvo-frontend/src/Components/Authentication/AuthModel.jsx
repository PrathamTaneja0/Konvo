import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';
import { useLocation, useNavigate } from 'react-router-dom';
import useColorMode from '../../theme/useColorMode';

  // Style is now defined inside the component to access theme
export default function AuthModal({ open, handleClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useColorMode();

  // Theme-aware modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.divider}`,
    boxShadow: 24,
    borderRadius: 2,
    outline: 'none',
    p: 4,
  };

  const isSignupPage = location.pathname === "/signup";
  const isSigninPage = location.pathname === "/signin";

  const handleNavigate = () => {
    if (isSignupPage) {
      navigate("/signin");
    } else {
      navigate("/signup");
    }
  };

  const getModalTitle = () => {
    if (isSignupPage) return "Create your Account";
    if (isSigninPage) return "Sign In to your Account";
    return "Welcome";
  };

  const getToggleText = () => {
    if (isSignupPage) return "Already have an Account?";
    if (isSigninPage) return "Don't have an Account?";
    return "";
  };

  const getButtonText = () => {
    if (isSignupPage) return "Sign in";
    if (isSigninPage) return "Sign up";
    return "";
  };

  


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className='text-center font-bold text-3xl pb-20' style={{ color: theme.palette.text.primary }}>
            {getModalTitle()}
          </h1>

          {isSignupPage ? <SignupForm /> : <SigninForm />}

          <h1 className='text-center py-5 font-semibold text-lg' style={{ color: theme.palette.text.secondary }}>
            {getToggleText()}
          </h1>

          <Button 
            variant='outlined'
            color='primary'
            onClick={handleNavigate} 
            fullWidth
            sx={{ 
              borderRadius: '29px', 
              py: 1.5,
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: 'rgba(29, 161, 242, 0.04)'
              }
            }}
          >
            {getButtonText()}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}