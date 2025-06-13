import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';
import { useLocation, useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 550,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 2,
  outline: 'none',
  p: 4,
};

export default function AuthModal({ open, handleClose }) {
  const location = useLocation();
  const navigate = useNavigate();

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
          <h1 className='text-center font-bold text-3xl pb-20'>
            {getModalTitle()}
          </h1>
          
          {isSignupPage ? <SignupForm /> : <SigninForm />}
          
          <h1 className='text-center py-5 font-semibold text-lg text-gray-500'>
            {getToggleText()}
          </h1>

          <Button 
            variant='outlined' 
            onClick={handleNavigate} 
            fullWidth
            sx={{ borderRadius: '29px', py: 1.5 }}
          >
            {getButtonText()}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}