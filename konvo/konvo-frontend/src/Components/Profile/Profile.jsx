import React, { useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useNavigate } from 'react-router-dom';
import moon from '../../assets/moon.jpg';
import { Avatar, Button, Box, Tabs, Tab } from '@mui/material';
import usericon from '../../assets/usericon.png';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import verify from '../../assets/verify.png';
import PostCard from '../HomeSection/PostCard';
import ProfileModal from './ProfileModal';

const defaultProfile = {
  fullName: "Snax Dark",
  bio: "Hello, I am Snax Dark",
  website: "",
  location: "Regensburg",
  profilePicture: usericon,
  backgroundImage: moon,
  joined: "June, 2025",
};

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);

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
    setProfile(prev => ({
      ...prev,
      ...values,
      profilePicture: values.profilePicture instanceof File ? URL.createObjectURL(values.profilePicture) : values.profilePicture,
      backgroundImage: values.backgroundImage instanceof File ? URL.createObjectURL(values.backgroundImage) : values.backgroundImage,
    }));
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
        <section className= {'bg-white z-50 flex items-center sticky top-0 bg-opacity-95 bg-white'}>
            <KeyboardBackspaceIcon className = 'cursor-pointer' onClick={handleBack} />
            <h1 className= {'text-xl font-bold py-5 opacity-90 ml-5'}>Profile</h1>
        </section>
        <section className="relative">
            <img className='w-full h-[15rem] object-cover' src={moon} alt="profile" />
            <Avatar
                alt={profile.fullName}
                src={profile.profilePicture}
                sx={{
                  width: '8rem',
                  height: '8rem',
                  border: '4px solid white',
                  position: 'absolute',
                  left: '2rem',
                  bottom: '-4rem',
                  bgcolor: 'white',
                  cursor: 'pointer',
                }}
                onClick={handleOpenProfileModel}
            />
            <Button
                onClick={isFollowing ? handleFollowUser : handleOpenProfileModel}
                variant='contained'
                sx={{
                  borderRadius: '20px',
                  position: 'absolute',
                  right: '2rem',
                  bottom: '-4rem',
                  paddingX: '1.5rem',
                  paddingY: '0.5rem',
                }}
            >
                {isFollowing ? "Unfollow" : "Edit Profile"}
            </Button>
        </section>
        <section>
        <div style={{ height: '4rem' }} />
        <div className='flex items-center px-4' >
            <h1 className='font-bold text-lg'>{profile.fullName}</h1>
            <img className="w-4 h-4 ml-2" src={verify} alt="verified" />
        </div>
        <h1 className='text-gray-500 px-4'>@Snax123</h1>
        <div className='mt-2 space-y-3 px-4'>
            <p>{profile.bio}</p>
            <div className='py-1 flex space-x-5'>
                {profile.website && (
                  <div className='flex items-center text-gray-500'>
                    <BusinessCenterIcon />
                    <p className='ml-2'>{profile.website}</p>
                  </div>
                )}
                {profile.location && (
                  <div className='flex items-center text-gray-500'>
                    <LocationOnIcon />
                    <p className='ml-2'>{profile.location}</p>
                  </div>
                )}
                <div className='flex items-center text-gray-500'>
                    <CalendarMonthIcon />
                    <p className='ml-2'>Joined: {profile.joined || "-"}</p>
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
                  {[1,1,1,1].map((item, index) => (
                    <PostCard key={index} />
                  ))}
                </div>
              )}
              {tabValue === 1 && <div>User's Replies</div>}
              {tabValue === 2 && <div>User's Media</div>}
              {tabValue === 3 && <div>User's Likes</div>}
            </Box>
          </Box>
        </section>
        <ProfileModal
          open={modalOpen}
          onClose={handleCloseProfileModel}
          initialValues={profile}
          onSave={handleSaveProfile}
        />
    </div>
  )
}

export default Profile