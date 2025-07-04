import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness6';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Button, IconButton, Tooltip } from '@mui/material';
import SubscriptionM from '../SubscriptionM/SubscriptionM';
import useColorMode from '../../theme/useColorMode';
import Box from '@mui/material/Box';
import { api } from '../Config/api';
import UserSearchResult from './UserSearchResult';
import { useSelector, useDispatch } from 'react-redux';
import { followUserAction } from '../../Store/Auth/Action';




const RightPart = () => {
  const [openSubscriptionM, setOpenSubscriptionM] = React.useState(false);
  const [news, setNews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [searchError, setSearchError] = React.useState(null);
  const auth = useSelector((store) => store.auth);
  const currentUserId = auth?.user?.id;
  const dispatch = useDispatch();

  
  React.useEffect(() => {
    setLoading(true);
    api.get('/api/news')
      .then(res => {
        setNews(res.data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load news');
        setLoading(false);
      });
  }, []);

  const handleOpenSubscriptionM = () => setOpenSubscriptionM(true);
  const handleCloseSubscriptionM = () => setOpenSubscriptionM(false);

  // Get theme mode and toggle function
  const { colorMode, mode } = useColorMode();
  const { theme } = useColorMode();
  const isDarkMode = mode === 'dark';

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await api.get(`/api/users/search?query=${encodeURIComponent(value)}`);
      setSearchResults(response.data);
    } catch {
      setSearchError('Could not search users');
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const handleFollowToggle = (user) => {
    dispatch(followUserAction(user.id));
    setSearchResults((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, followed: !u.followed } : u
      )
    );
  };

    return (
    <div className='py-3 px-4 sticky top-0 h-screen w-full flex flex-col gap-6'>
      <div className='relative flex items-center mb-4'>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
          className='py-3 rounded-full  w-full pl-12  focus:outline-none focus:ring-1 focus:ring-blue-400'
          style={{color: theme.palette.text.primary, backgroundColor: theme.palette.custom.cardBackground}}
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

      {searchQuery && (
        <div className="mb-4 rounded-xl p-3" style={{color: theme.palette.text.primary, backgroundColor: theme.palette.custom.cardBackground}}>
          {searchLoading && <div>Searching...</div>}
          {searchError && <div className="text-red-500">{searchError}</div>}
          {!searchLoading && !searchError && (
            <UserSearchResult users={searchResults} onFollowToggle={handleFollowToggle} currentUserId={currentUserId} theme={theme} isDarkMode={isDarkMode} />
          )}
        </div>
      )}

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
        <Box
          className='space-y-4'
          sx={{
            color: theme.palette.text.primary,
            height: { xs: '30vh', sm: '35vh', md: '40vh' },
            overflowY: 'auto',
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari, Edge
          }}
        >
          {loading && <p>Loading news...</p>}
          {error && <p className='text-red-500'>{error}</p>}
          {!loading && !error && news.map((article, idx) => (
            <div 
              key={idx}
              className='cursor-pointer transition-colors p-2 rounded-lg'
              onClick={() => window.open(article.url, '_blank')}
            >
              <p className='text-sm opacity-60'>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</p>
              <p className='font-semibold'>{article.title}</p>
              {article.description && <p className='text-xs opacity-80'>{article.description}</p>}
            </div>
          ))}
        </Box>
      </section>
      <section>
        <SubscriptionM open={openSubscriptionM} handleClose={handleCloseSubscriptionM} />
      </section>
    </div>
  )
}

export default RightPart