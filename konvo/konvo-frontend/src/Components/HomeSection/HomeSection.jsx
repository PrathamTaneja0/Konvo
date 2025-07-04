import React from "react";
import { Avatar, Button } from "@mui/material";
import * as Yup from "yup";
import ImageIcon from "@mui/icons-material/Image";
import PostCard from "./PostCard";
import PostSection from "./PostSection";
import useColorMode from "../../theme/useColorMode";
import TextField from "@mui/material/TextField";
import PostForm from "./PostForm";

const HomeSection = () => {
  const { theme } = useColorMode();

  return (
    <div >
      <div className="max-w-xl mx-auto px-4">
        <section>
          <h1 className="py-5 text-xl font-bold opacity-90">Home</h1>
        </section>
        
        <section className="pb-5 border-b border-gray-100"    style={{ backgroundColor: theme.palette.background.default }}>
          <PostForm onPostSuccess={() => {}} />
        </section>

        <section>
          <PostSection />
        </section>
      </div>
    </div>
  );
};

export default HomeSection;

  