import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness6';
import { Button } from '@mui/material';
import SubscriptionM from '../SubscriptionM/SubscriptionM';

const RightPart = () => {
  const [openSubscriptionM, setOpenSubscriptionM] = React.useState(false);

  const handleOpenSubscriptionM = () => setOpenSubscriptionM(true);
  const handleCloseSubscriptionM = () => setOpenSubscriptionM(false);

  const handleChangeTheme = () => {
    console.log("Theme changed");
  }

  return (
    <div className='py-3 px-4 sticky top-0 h-screen w-full flex flex-col gap-6' style={{background: 'white'}}>
      <div className='relative flex items-center mb-4'>
        <input
          type="text"
          placeholder="Search"
          className='py-3 rounded-full text-gray-500 w-full pl-12 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400'
        />
        <div className='absolute top-0 left-0 pl-3 pt-3'>
          <SearchIcon className='text-gray-500' />
        </div>
        <Brightness4Icon className='ml-3 cursor-pointer' onClick={handleChangeTheme} />
      </div>

      <section className='bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors'>
        <h1 className='text-xl font-bold'>Get Verified</h1>
        <h1 className='font-bold my-2'>Subscribe to unlock new Features</h1>
        <Button 
          variant='contained' 
          onClick={handleOpenSubscriptionM}
          sx={{ 
            padding: "10px", 
            paddingX: "20px", 
            borderRadius: "25px",
            bgcolor: "#1da1f2",
            "&:hover": {
              bgcolor: "#1a91da"
            }
          }}
        >
          Get Verified
        </Button>
      </section>

      <section className='bg-gray-50 rounded-xl p-4'>
        <h1 className='text-xl font-bold mb-4'>What's happening</h1>
        <div className='space-y-4'>
          <div className='cursor-pointer hover:bg-gray-100 transition-colors p-2 rounded-lg'>
            <p className='text-sm text-gray-500'>Sports · Live</p>
            <p className='font-semibold'>FIFA Women's World Cup Live</p>
            <p className='text-sm text-gray-500'>Trending with #FIFAWWC</p>
          </div>
          <div className='cursor-pointer hover:bg-gray-100 transition-colors p-2 rounded-lg'>
            <p className='text-sm text-gray-500'>Technology · Trending</p>
            <p className='font-semibold'>AI Revolution</p>
            <p className='text-sm text-gray-500'>2.5M posts</p>
          </div>
          <div className='cursor-pointer hover:bg-gray-100 transition-colors p-2 rounded-lg'>
            <p className='text-sm text-gray-500'>Entertainment · Trending</p>
            <p className='font-semibold'>Latest Movie Releases</p>
            <p className='text-sm text-gray-500'>1.2M posts</p>
          </div>
        </div>
      </section>
      <section>
        <SubscriptionM open={openSubscriptionM} handleClose={handleCloseSubscriptionM} />
      </section>
    </div>
  )
}

export default RightPart