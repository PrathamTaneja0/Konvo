import HomeIcon from "@mui/icons-material/Home";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";


export const navigationMenu = [
    {
        title: "Home",
        icon: <HomeIcon />,
        path: "/home"
    },
    {
        title: "Verified",
        icon: <VerifiedIcon />,
        path: "/verified"
    },
    {
        title: "Profile",
        icon: <AccountCircleIcon />,
        path: "/profile"
    }
];