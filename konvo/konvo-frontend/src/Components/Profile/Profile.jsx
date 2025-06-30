import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate, useParams } from 'react-router-dom';
import moon from '../../assets/moon.jpg';
import userIcon from '../../assets/userIcon.png';
import { Avatar, Button, Box, Tabs, Tab } from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import verify from '../../assets/verify.png';
import PostCard from '../HomeSection/PostCard';
import ProfileModal from './ProfileModal';
import useColorMode from "../../theme/useColorMode";
import CakeIcon from '@mui/icons-material/Cake';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserProfile, findUserById } from '../../Store/Auth/Action';

const Profile = () => {
    const { theme } = useColorMode();
    const dispatch = useDispatch();
    const auth = useSelector(store => store.auth);
    const { id } = useParams();
    const loggedInUser = auth.user || {};
    const otherUser = auth.findUser || {};
    const isOwnProfile = !id || String(loggedInUser.id) === String(id);
    const user = isOwnProfile ? loggedInUser : otherUser;
    const [tabValue, setTabValue] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    React.useEffect(() => {
      if (!id || !loggedInUser.id) return; // Wait until both are defined
      if (String(loggedInUser.id) !== String(id)) {
        dispatch(findUserById(id));
      }
    }, [id, loggedInUser.id, dispatch]);

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
      if(newValue === 4){
        console.log("likes posts");
      }
      else if(newValue === 1){
        console.log("user posts");
      }
    };

    const handleOpenProfileModel = () => {
      setModalOpen(true);
    }

    const handleCloseProfileModel = () => {
      setModalOpen(false);
    }

    const handleSaveProfile = async (values) => {
      // Ensure location defaults to 'Earth' if empty
      const updatedValues = { ...values, location: values.location || 'Earth' };
      await dispatch(updateUserProfile(updatedValues));
      setModalOpen(false);
    };

    const handleFollowUser = () => {
      setIsFollowing(!isFollowing);
      console.log(isFollowing ? "Unfollowed user" : "Followed user");
    }

    const navigate = useNavigate();
    const handleBack = () => {
      navigate(-1);
    }

    return (
      <div className="w-full">
          <section className= {' z-50 flex items-center sticky top-0 bg-opacity-95 ' } style={{backgroundColor: theme.palette.background.default}}>
              <KeyboardBackspaceIcon className = 'cursor-pointer' onClick={handleBack} />
              <h1 className= {'text-xl font-bold py-5 opacity-90 ml-5'}>Profile</h1>
          </section>
          <section className="relative">
              <img className='w-full h-[15rem] object-cover' src={user.backgroundImage || moon} alt="profile" />
              <Avatar
                  alt={user.fullName}
                  src={user.image || userIcon}
                  sx={{
                    width: '8rem',
                    height: '8rem',
                    border: '4px solid white',
                    position: 'absolute',
                    left: '2rem',
                    bottom: '-4rem',
                    bgcolor: 'white',
                    cursor: isOwnProfile ? 'pointer' : 'default',
                  }}
                  onClick={isOwnProfile ? handleOpenProfileModel : undefined}
              />
              {isOwnProfile && (
                <Button
                    onClick={isFollowing ? handleFollowUser : handleOpenProfileModel}
                    variant='contained'
                    color='primary'
                    sx={{
                        borderRadius: '20px',
                        position: 'absolute',
                        right: '2rem',
                        bottom: '-4rem',
                        paddingX: '1.5rem',
                        paddingY: '0.5rem',
                        bgcolor: "#000000",
                        "&:hover": {
                            bgcolor: "#1a91da",
                        },
                    }}
                >
                    {isFollowing ? "Unfollow" : "Edit Profile"}
                </Button>
              )}
          </section>
          <section>
          <div style={{ height: '4rem' }} />
          <div className='flex items-center px-4' >
              <h1 className='font-bold text-lg'>{user.fullName}</h1>
              <img className="w-4 h-4 ml-2" src={verify} alt="verified" />
          </div>
          <h1 className='text-gray-500 px-4'>@{user.username}</h1>
          <div className='mt-2 space-y-3 px-4'>
              <p>{user.bio}</p>
              <div className='py-1 flex space-x-5'>
                  {user.website && (
                    <div className='flex items-center text-gray-500'>
                      <BusinessCenterIcon />
                      <p className='ml-2'>{user.website}</p>
                    </div>
                  )}
                  <div className='flex items-center text-gray-500'>
                      <LocationOnIcon />
                      <p className='ml-2'>{user.location || 'Earth'}</p>
                  </div>
                  <div className='flex items-center text-gray-500'>
                      <CakeIcon />
                      <p className='ml-2'>{user.birthDate ? user.birthDate : '-'}</p>
                  </div>
              </div>
              <div className='flex items-center space-x-5'>
                  <div className='flex items-center space-x-1 '>
                      <span className='font-semibold'>540</span>
                      <span className="ml-1 text-gray-500">Following</span>
                  </div>
                  <div className='flex items-center space-x-1 '>
                      <span className='font-semibold'>590</span>
                      <span className="ml-1 text-gray-500">Followers</span>
                  </div>
              </div>
          </div>
          </section>
          <section className='mt-3'>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
                  <Tab label="Posts" />
                  <Tab label="Replies" />
                  <Tab label="Media" />
                  <Tab label="Likes" />
                </Tabs>
              </Box>
              <Box>
                {tabValue === 0 && (
                  <div>
                    {/* TODO: Replace with real user posts from Redux or props */}
                    {/* Example: userPosts.map((post) => <PostCard key={post.id} post={post} />) */}
                  </div>
                )}
                {tabValue === 1 && <div>User's Replies</div>}
                {tabValue === 2 && <div>User's Media</div>}
                {tabValue === 3 && <div>User's Likes</div>}
              </Box>
            </Box>
          </section>
          {isOwnProfile && (
            <ProfileModal
              open={modalOpen}
              onClose={handleCloseProfileModel}
              initialValues={{
                ...user,
                location: user.location || 'Earth',
                birthDate: user.birthDate || '',
              }}
              onSave={handleSaveProfile}
            />
          )}
      </div>
    )
}

export default Profile