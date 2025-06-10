import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import verify from '../../assets/verify.png';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: 'none',
  outline: 'none',
  boxShadow: 24,
  borderRadius: 4,
  p: 0,
};

export default function SubscriptionM({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* Close Button */}
        <div className="flex items-center justify-between px-3 pt-3">
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </div>

        {/* Black Info Box */}
        <div className="flex items-center bg-black rounded-lg mx-6 mt-2 mb-4 p-4">
          <div className="flex-1">
            <span className="text-white text-lg font-semibold">
              <h1>Blue subscribers with a verified phone number will get a blue checkmark once approved.</h1>
            </span>
          </div>
          <img
            src={verify}
            alt="blue checkmark"
            className="w-12 h-12 ml-4"
          />
        </div>

        {/* Save and Monthly Row */}
        <div className="flex items-center justify-between px-6 py-3 rounded-full border border-gray-300 mb-2 mx-6">
          <span className="text-green-600 font-bold text-base">SAVE 12%</span>
          <span className="text-gray-500 font-semibold text-base">Monthly</span>
        </div>

        {/* Features List */}
        <ul className="px-8 pb-2 text-gray-800 text-base space-y-2 list-disc">
          <li>Prioritized rankings in conversations and search</li>
          <li>See approximately twice as many Tweets between ads in your For You and Following timelines.</li>
          <li>Add bold and italic text in your Tweets.</li>
          <li>Post longer videos and 1080p video uploads.</li>
          <li>All the existing Blue features, including Edit Tweet, Bookmark Folders and early access to new features.</li>
        </ul>

        {/* Pricing */}
        <div className="flex items-center justify-center pb-6 pt-2">
          <button
            className="flex items-center justify-center w-full max-w-xs py-2 rounded-full cursor-pointer bg-[#111827] focus:outline-none"
            style={{ minWidth: 300 }}
          >
            <span className="text-gray-400 line-through italic text-lg mr-4">₹7,800.00</span>
            <span className="text-white text-xl font-semibold">₹6,800/year</span>
          </button>
        </div>
      </Box>
    </Modal>
  );
}
