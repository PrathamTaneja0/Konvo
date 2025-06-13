import React, { useState } from 'react';
// Import images correctly
import bg_auth from '../../Assets/bg_auth.jpg';
import logo_auth from '../../Assets/logo_auth.png';
import Grid from '@mui/material/Grid';
import { Button, useScrollTrigger } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthModal from './AuthModel';

const Authentication = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const [openAuthModel,setOpenAuthModel] = useState(false);
  const handleOpenAuthModel = () => setOpenAuthModel(true);
  const handleCloseAuthModel = () => setOpenAuthModel(false);

  // const handleGoogleSuccess = (credentialResponse) => {
  //   console.log(credentialResponse);
  //   // Handle the Google login response
  //   // Example: dispatch(loginWithGoogle(credentialResponse));
  // };

  // const handleGoogleError = () => {
  //   console.log('Google Sign In was unsuccessful');
  //   // Handle login error
  // };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Grid container sx={{ height: '100%' }}>
        {/* Left section with background image */}
        <Grid 
    
          size={{ xs: 0, sm: 0, md: 7, lg: 7 }}
          sx={{   
            position: 'relative',
            display: { xs: 'none', sm: 'none', md: 'block' },
            height: '100%'
          }}
        >
          {/* Use inline style for background image as an alternative approach */}
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: `url(${bg_auth})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            {/* Logo centered on background */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img 
                src={logo_auth} 
                alt="Konvo Logo" 
                className="w-48" 
              />
            </div>
          </div>
        </Grid>

        {/* Right section with login form */}
        <Grid 
          size={{ xs: 12, sm: 12, md: 5, lg: 5 }}
          sx={{ 
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: '20px', sm: '30px', md: '40px' }
          }}
        >
          <div className="w-full max-w-md mx-auto ">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-10 text-center">
              Welcome to Konvo
            </h1>

            <div className="w-full md:w-[80%] lg:w-[70%] mx-auto">
              <div className="w-full mb-8">
                {/* Google login button with custom styling */}
                <div style={{ marginBottom: '16px' }}>
                  <GoogleLogin
                    width={330}
                    theme="outline"
                    shape="rectangular"
                    text="signin_with"
                    logo_alignment="center"
                    // You can add onSuccess/onError handlers here
                  />
                </div>
                <p className="py-5 text-center font-medium">OR</p>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: "29px", py: "12px" }}
                  onClick={handleOpenAuthModel}

                >
                  Create Account
                </Button>
              </div>

              <div className="mt-10">
                <h1 className="font-bold text-xl mb-5 text-center">
                  Already Have an Account?
                </h1>
                <Button 
                  fullWidth
                  variant="outlined"
                  size="large"
                  sx={{ borderRadius: "29px", py: "12px" }}
                  onClick={handleOpenAuthModel}
                >
                  Log in
                </Button>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      <AuthModal open={openAuthModel} handleClose={handleCloseAuthModel} />
    </div>
  );
};

export default Authentication;