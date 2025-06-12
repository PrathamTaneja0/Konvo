// // import React from 'react';
// // import Grid from '@mui/material/Grid';
// // import { Button } from '@mui/material';
// // import GoogleLogin from './GoogleLogin'; // Assuming this component exists in your project
// //
// // const Authentication = () => {
// //   return (
// //     <div>
// //       <Grid className='overflow-y-hidden' container>
// //         <Grid className='hidden lg:block relative' item lg={7}>
// //           {/* Background image */}
// //           <img src="bg_auth.jpg" alt="Background" className="w-full h-screen object-cover" />
// //
// //           {/* Logo centered on background */}
// //           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
// //             <img src="logo_auth.png" alt="Konvo Logo" className="w-48" /> {/* Adjust width as needed */}
// //           </div>
// //         </Grid>
// //
// //         <Grid className="px-10 flex items-center" item lg={5} xs={12}>
// //           <div className="w-full">
// //             <h1 className='font-bold text-7xl mb-10'> Welcome to Konvo </h1>
// //
// //             <div className="w-[60%] mx-auto">
// //               <div className="w-full mb-8">
// //                 <GoogleLogin width={330} />
// //                 <p className="py-5 text-center font-medium">OR</p>
// //                 <Button
// //                   fullWidth
// //                   variant="contained"
// //                   size="large"
// //                   sx={{ borderRadius: "29px", py: "12px" }}
// //                 >
// //                   Create Account
// //                 </Button>
// //               </div>
// //
// //               <div className="mt-10">
// //                 <h1 className='font-bold text-xl mb-5'>Already Have an Account?</h1>
// //                 <Button
// //                   fullWidth
// //                   variant="outlined"
// //                   size="large"
// //                   sx={{ borderRadius: "29px", py: "12px" }}
// //                 >
// //                   Sign In
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>
// //         </Grid>
// //       </Grid>
// //     </div>
// //   );
// // };
// //
// // export default Authentication;
//
// import React from 'react';
// import { Button } from '@mui/material';
//
// // Simple placeholder if you don't have the actual GoogleLogin component
// const GoogleLogin = ({ width }) => {
//   return (
//       <Button
//           fullWidth
//           variant="outlined"
//           size="large"
//           sx={{
//             borderRadius: "29px",
//             py: "12px",
//             width: width ? `${width}px` : '100%',
//             backgroundColor: 'white',
//             color: '#757575',
//             border: '1px solid #dadce0',
//             '&:hover': {
//               backgroundColor: '#f8f9fa',
//               border: '1px solid #dadce0',
//             }
//           }}
//       >
//         <img
//             src="google-icon.png"
//             alt="Google"
//             style={{ width: '20px', marginRight: '10px' }}
//         />
//         Continue with Google
//       </Button>
//   );
// };
//
// export default GoogleLogin;


import React from 'react';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const Authentication = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    // Handle the Google login response
    // You might want to dispatch a Redux action here to authenticate the user
    // Example: dispatch(loginWithGoogle(credentialResponse));
  };

  const handleGoogleError = () => {
    console.log('Google Sign In was unsuccessful');
    // Handle login error
  };

  return (
      <div>
        <Grid className='overflow-y-hidden' container>
          <Grid className='hidden lg:block relative' item lg={7}>
            {/* Background image */}
            <img src="bg_auth.jpg" alt="Background" className="w-full h-screen object-cover" />

            {/* Logo centered on background */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img src="logo_auth.png" alt="Konvo Logo" className="w-48" />
            </div>
          </Grid>

          <Grid className="px-10 flex items-center" item lg={5} xs={12}>
            <div className="w-full">
              <h1 className='font-bold text-7xl mb-10'>Welcome to Konvo</h1>

              <div className="w-[60%] mx-auto">
                <div className="w-full mb-8">
                  <div className="flex justify-center mb-2">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        width="330"
                        text="signin_with"
                        logo_alignment="center"
                        shape="rectangular"
                    />
                  </div>
                  <p className="py-5 text-center font-medium">OR</p>
                  <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ borderRadius: "29px", py: "12px" }}
                      onClick={handleCreateAccount}
                  >
                    Create Account
                  </Button>
                </div>

                <div className="mt-10">
                  <h1 className='font-bold text-xl mb-5'>Already Have an Account?</h1>
                  <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      sx={{ borderRadius: "29px", py: "12px" }}
                      onClick={handleSignIn}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
  );
};

export default Authentication;