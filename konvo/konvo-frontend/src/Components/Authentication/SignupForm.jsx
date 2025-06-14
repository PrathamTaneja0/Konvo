import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Box, Button, InputAdornment, IconButton, MenuItem, FormControl, FormHelperText } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Store/Auth/Action";

const SignupForm = ({ onSubmit }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();
    const { loading, error } = useSelector(store => store.auth);

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .min(2, "First name must be at least 2 characters")
            .required("First name is required"),
        lastName: Yup.string()
            .min(2, "Last name must be at least 2 characters")
            .required("Last name is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required("Confirm password is required"),
        day: Yup.number()
            .min(1, "Invalid day")
            .max(31, "Invalid day")
            .required("Day is required"),
        month: Yup.number()
            .min(1, "Invalid month")
            .max(12, "Invalid month")
            .required("Month is required"),
        year: Yup.number()
            .min(1900, "Invalid year")
            .max(new Date().getFullYear() - 13, "You must be at least 13 years old")
            .required("Year is required"),
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            day: "",
            month: "",
            year: ""
        },
        validationSchema,
        onSubmit: (values) => {
            const registerData = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                dateOfBirth: `${values.year}-${String(values.month).padStart(2, '0')}-${String(values.day).padStart(2, '0')}`
                
            };


            dispatch(registerUser(registerData));

            if (onSubmit) onSubmit(registerData);

            console.log("form values: ", values);
        },
    });



    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Generate years from 1900 to current year - 13 (minimum age requirement)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 - 12 }, (_, i) => currentYear - 13 - i);

// Generate months 1-12
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

// Generate days 1-31
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <Box sx={{ height: '400px', overflow: 'auto', pr: 1 }}>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            id="firstName"
                            name="firstName"
                            label="First Name"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                            helperText={formik.touched.firstName && formik.errors.firstName}
                            variant="outlined"
                            margin="dense"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            id="lastName"
                            name="lastName"
                            label="Last Name"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                            helperText={formik.touched.lastName && formik.errors.lastName}
                            variant="outlined"
                            margin="dense"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            variant="outlined"
                            margin="dense"
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            variant="outlined"
                            margin="dense"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                            variant="outlined"
                            margin="dense"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={toggleConfirmPasswordVisibility}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <VisibilityIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ mt: 1, mb: 1 }}>
                            <FormHelperText sx={{ ml: 1, mb: 1, fontWeight: 500 }}>Date of Birth</FormHelperText>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 4 }}>
                                    <FormControl fullWidth error={formik.touched.day && Boolean(formik.errors.day)}>
                                        <TextField
                                            select
                                            id="day"
                                            name="day"
                                            label="Day"
                                            value={formik.values.day}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.day && Boolean(formik.errors.day)}
                                            helperText={formik.touched.day && formik.errors.day}
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth
                                        >
                                            <MenuItem value="">Select Day</MenuItem>
                                            {days.map((day) => (
                                                <MenuItem key={day} value={day}>{day}</MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <FormControl fullWidth error={formik.touched.month && Boolean(formik.errors.month)}>
                                        <TextField
                                            select
                                            id="month"
                                            name="month"
                                            label="Month"
                                            value={formik.values.month}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.month && Boolean(formik.errors.month)}
                                            helperText={formik.touched.month && formik.errors.month}
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth
                                        >
                                            <MenuItem value="">Select Month</MenuItem>
                                            {months.map((month) => (
                                                <MenuItem key={month} value={month}>
                                                    {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 4 }}>
                                    <FormControl fullWidth error={formik.touched.year && Boolean(formik.errors.year)}>
                                        <TextField
                                            select
                                            id="year"
                                            name="year"
                                            label="Year"
                                            value={formik.values.year}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.year && Boolean(formik.errors.year)}
                                            helperText={formik.touched.year && formik.errors.year}
                                            variant="outlined"
                                            margin="dense"
                                            fullWidth
                                        >
                                            <MenuItem value="">Select Year</MenuItem>
                                            {years.map((year) => (
                                                <MenuItem key={year} value={year}>{year}</MenuItem>
                                            ))}
                                        </TextField>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                            sx={{ borderRadius: "29px", py: 1.5 }}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </Grid>

                    {error && (
                        <Grid size={{ xs: 12 }}>
                            <div className="text-red-500 text-center mt-2">
                                {error}
                            </div>
                        </Grid>
                    )}
                </Grid>
            </form>
        </Box>
    );
};

export default SignupForm;