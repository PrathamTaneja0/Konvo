import React from "react";
import { Grid, Container } from "@mui/material";
import Navigation from "../Navigation/Navigation";
import HomeSection from "../HomeSection/HomeSection";
import RightPart from "../RightPart/RightPart";
import { Route, Routes } from "react-router-dom";
import Profile from "../Profile/Profile";
import PostDetails from "../PostDetails/PostDetails";

export default function HomePage() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        pl: { xs: 3, md: 8 },
        pr: { xs: 1, md: 2 },
      }}
    >
      <Grid container columns={12}>
        {/* Left Navigation */}
        <Grid
          item
          xs={0}
          md={3}
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
          <Navigation />
        </Grid>

        {/* Main Content */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            minHeight: "100vh",
            borderRight: "1px solid #eff3f4",
            borderLeft: { xs: "1px solid #eff3f4", md: "none" },
            px: { xs: 0, md: 2 },
            bgcolor: "background.paper",
            maxWidth: 700,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Routes>
            <Route path="/" element={<HomeSection />} />
            <Route path="/home" element={<HomeSection />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/tweet/:id" element={<PostDetails />} />
          </Routes>
        </Grid>

        {/* Right Section */}
        <Grid
          item
          xs={0}
          md={3}
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
          <RightPart />
        </Grid>
      </Grid>
    </Container>
  );
}
