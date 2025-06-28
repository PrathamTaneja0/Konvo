import React, { useState } from "react";
import { Grid, Container, IconButton, Drawer } from "@mui/material";
import Navigation from "../Navigation/Navigation";
import HomeSection from "../HomeSection/HomeSection";
import RightPart from "../RightPart/RightPart";
import { Route, Routes } from "react-router-dom";
import Profile from "../Profile/Profile";
import PostDetails from "../PostDetails/PostDetails";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

export default function HomePage() {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

  const toggleLeftDrawer = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  const toggleRightDrawer = () => {
    setRightDrawerOpen(!rightDrawerOpen);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        // pl: { xs: 3, md: 8 },
        // pr: { xs: 1, md: 2 },
      }}
    >
      <Grid container columns={12}>
        {/* Mobile Navigation Button - Left */}
        <IconButton
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1100,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" }
          }}
          onClick={toggleLeftDrawer}
          size="large"
        >
          <MenuIcon />
        </IconButton>

        {/* Left Navigation Drawer for Mobile */}
        <Drawer
          anchor="left"
          open={leftDrawerOpen}
          onClose={toggleLeftDrawer}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: "70%", maxWidth: 280 },
          }}
        >
          <Navigation onNavItemClick={toggleLeftDrawer} />
        </Drawer>

        {/* Left Navigation for Desktop */}
        <Grid
          size={{ xs: 0, md: 3 }}
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: 0,
            height: "100vh",
            borderRight: "1px solid #eff3f4",
            pl: { md: 2, lg: 4 },
            bgcolor: "background.paper",
          }}
        >
          <Navigation onNavItemClick={() => {}} />
        </Grid>

        {/* Main Content */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            minHeight: "100vh",
            borderRight: "1px solid #eff3f4",
            borderLeft: { xs: "1px solid #eff3f4", md: "none" },
            px: { xs: 0, md: 2 },
            pt: { xs: 5, md: 0 }, // Added top padding on mobile to prevent overlap
            bgcolor: "background.paper",
            maxWidth: 700,
            width: '100%',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <Routes>
            <Route path="/" element={<HomeSection />} />
            <Route path="/home" element={<HomeSection />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/tweet/:id" element={<PostDetails />} />
          </Routes>
        </Grid>

        {/* Mobile Navigation Button - Right */}
        <IconButton
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 1100,
            bgcolor: "background.paper",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" }
          }}
          onClick={toggleRightDrawer}
          size="large"
        >
          <SearchIcon />
        </IconButton>

        {/* Right Section Drawer for Mobile */}
        <Drawer
          anchor="right"
          open={rightDrawerOpen}
          onClose={toggleRightDrawer}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: "70%", maxWidth: 280 },
          }}
        >
          <RightPart onItemClick={toggleRightDrawer} />
        </Drawer>

        {/* Right Section for Desktop */}
        <Grid
          size={{ xs: 0, md: 3 }}
          sx={{
            display: { xs: "none", md: "block" },
            position: "sticky",
            top: 0,
            height: "100vh",
            pl: { md: 2, lg: 4 },
            bgcolor: "background.paper",
            maxWidth: 350,
          }}
        >
          <RightPart onItemClick={() => {}} />
        </Grid>
      </Grid>
    </Container>
  );
}
