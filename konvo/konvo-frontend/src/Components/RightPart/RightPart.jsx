import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness6';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button, IconButton, Tooltip } from '@mui/material';
import SubscriptionM from '../SubscriptionM/SubscriptionM';
import useColorMode from '../../theme/useColorMode';




const RightPart = ({ onItemClick }) => {
  const [openSubscriptionM, setOpenSubscriptionM] = React.useState(false);

  const handleOpenSubscriptionM = () => setOpenSubscriptionM(true);
  const handleCloseSubscriptionM = () => setOpenSubscriptionM(false);

  // Get theme mode and toggle function
  const { colorMode, mode } = useColorMode();
  const { theme } = useColorMode();


    return (
    <div className='py-3 px-4 sticky top-0 h-screen w-full flex flex-col gap-6'>
      <div className='relative flex items-center mb-4'>
        <input
          type="text"
          placeholder="Search"
          // className='py-3 rounded-full text-gray-500 w-full pl-12 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400'
            className='py-3 rounded-full  w-full pl-12  focus:outline-none focus:ring-1 focus:ring-blue-400' style={{color: theme.palette.text.primary,
            backgroundColor: theme.palette.custom.cardBackground
        }}

        />
        <div className='absolute top-0 left-0 pl-3 pt-3 pr-0'>  
          <SearchIcon className='text-gray-500' />
        </div>
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={colorMode.toggleColorMode} sx = {{ml:1}}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </div>

      <section className=' rounded-xl p-4  transition-colors ' style={{color: theme.palette.text.primary,
          backgroundColor: theme.palette.custom.cardBackground
      }}>

        <h1 className='text-xl font-bold'>Get Verified</h1>
        <h1 className='font-bold my-2'>Subscribe to unlock new Features</h1>
        <Button 
          variant='contained' 
          color='primary'
          onClick={handleOpenSubscriptionM}
          sx={{ 
            padding: "10px", 
            paddingX: "20px", 
            borderRadius: "25px",
          }}
        >
          Get Verified
        </Button>
      </section>

      <section className=' rounded-xl p-4' style={{color: theme.palette.text.primary,
          backgroundColor: theme.palette.custom.cardBackground
      }}>

        <h1 className='text-xl font-bold mb-4'>Trending</h1>
        <div className='space-y-4' style={{color: theme.palette.text.primary}}>
          <div 
            className='cursor-pointer  transition-colors p-2 rounded-lg'
            onClick={() => onItemClick && onItemClick()}
          >
            <p className='text-sm opacity-60 '>Sports · Live</p>
            <p className='font-semibold'>FIFA Women's World Cup Live</p>
          </div>
          <div 
            className='cursor-pointer  transition-colors p-2 rounded-lg'
            onClick={() => onItemClick && onItemClick()}
          >
            <p className='text-sm opacity-60 '>Technology · Trending</p>
            <p className='font-semibold'>AI Revolution</p>
          </div>
          <div 
            className='cursor-pointer  transition-colors p-2 rounded-lg'
            onClick={() => onItemClick && onItemClick()}
          >
            <p className='text-sm opacity-60 '>Entertainment · Trending</p>
            <p className='font-semibold'>Latest Movie Releases</p>
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