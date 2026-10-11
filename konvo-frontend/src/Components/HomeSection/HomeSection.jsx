import React from "react";
import useColorMode from "../../theme/useColorMode";
import PostForm from "./PostForm";
import PostSection from "./PostSection";
import { useDispatch } from "react-redux";
import { getAllPosts } from "../../Store/Post/Action";

const HomeSection = () => {
  const { theme } = useColorMode();
  const dispatch = useDispatch();

  return (
    <main>
      <div className="max-w-xl mx-auto px-4">
        <header>
          <h1 className="py-5 text-xl font-bold opacity-90">Home</h1>
        </header>
        <section
          className="pb-5 border-b border-gray-100"
          style={{ backgroundColor: theme.palette.background.default }}
        >
          <PostForm onPostSuccess={() => dispatch(getAllPosts())} />
        </section>
        <section>
          <PostSection />
        </section>
      </div>
    </main>
  );
};

export default HomeSection;

  