import Head from 'next/head'
import NextLink from 'next/link'
import Router, { useRouter } from 'next/router'
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography, useTheme } from '@mui/material';

import { Google as GoogleIcon } from '../icons/google';
import { useAuthStore } from 'stores/useAuthStore';
import { useState } from 'react';

const Login = () => {
    const theme = useTheme();
    const router = useRouter();
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
    const verifyUser = useAuthStore((state) => state.verifyUser);

    const initialValues = {
        email: '',
        password: ''
    };

    const handleLoginDefault = (values) => {
        setIsBtnDisabled(true);
        setIsBtnDisabled(true);
        verifyUser({
            email: values.email,
            password: values.password
        })
            .then(() => {
                setIsBtnDisabled(false);
            })
            .then(() => {
                setIsBtnDisabled(false);
            });
    };

    const handleLoginWithGoogle = () => {
        setIsBtnDisabled(true);
        loginWithGoogle().then(() => {
            setIsBtnDisabled(false);

            router.replace('/dashboard');
            console.log('GO TO DASHBOARD');
        });
    };

    const formik = useFormik({
        initialValues,
        onSubmit: handleLoginDefault
    });

    return (
        <>
            <Head>
                <title>Login | CASH: Financial Monitoring Application</title>
            </Head>
            <Box
                component='main'
                sx={{
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    display: 'flex',
                    flexGrow: 1,
                    minHeight: '100%'
                }}
            >
                <Container maxWidth='sm'>
                    <form onSubmit={formik.handleSubmit}>
                        <Box sx={{ my: 3, textAlign: { xs: 'center', lg: 'initial' } }}>
                            <Typography color='textPrimary' variant='h4'>
                                Log in
                            </Typography>
                            <Typography color='textSecondary' gutterBottom variant='body2'>
                                Start monitoring your finances.
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6} lg={12}>
                                <Button
                                    color='error'
                                    fullWidth
                                    onClick={handleLoginWithGoogle}
                                    size='large'
                                    startIcon={<GoogleIcon />}
                                    variant='contained'
                                    disabled={isBtnDisabled}
                                >
                                    Login with Google
                                </Button>
                            </Grid>
                        </Grid>
                        <Box
                            sx={{
                                pb: 1,
                                pt: 3
                            }}
                        >
                            <Typography align='center' color='textSecondary' variant='body1'>
                                or login with email address
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            label='Email Address'
                            margin='normal'
                            name='email'
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type='email'
                            value={formik.values.email}
                            variant='outlined'
                        />
                        <TextField
                            fullWidth
                            label='Password'
                            margin='normal'
                            name='password'
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            type='password'
                            value={formik.values.password}
                            variant='outlined'
                        />
                        <Box sx={{ py: 2 }}>
                            <Button
                                color='primary'
                                fullWidth
                                size='large'
                                type='submit'
                                variant='contained'
                                onClick={formik.handleSubmit}
                                disabled={isBtnDisabled}
                            >
                                Log In Now
                            </Button>
                        </Box>
                        <Typography color='textSecondary' variant='body2'>
                            Don&apos;t have an account?{' '}
                            <NextLink href='/register'>
                                <Link
                                    to='/register'
                                    variant='subtitle2'
                                    underline='hover'
                                    sx={{
                                        cursor: 'pointer'
                                    }}
                                >
                                    Sign Up
                                </Link>
                            </NextLink>
                        </Typography>
                    </form>
                </Container>

                <Box
                    sx={{
                        width: '50%',
                        height: '100vh',
                        overflow: 'hidden',
                        display: {
                            xs: 'none',
                            md: 'flex'
                        },
                        alignItems: 'center',
                        position: 'relative',
                        justifyContent: 'center'
                    }}
                >
                    <Typography
                        variant='h2'
                        position='absolute'
                        sx={{ zIndex: 10, color: 'white', textAlign: 'center', width: '80%' }}
                    >
                        <span style={{ color: theme.palette.primary.main }}>Learn</span> about Financial Literacy
                    </Typography>
                    <img
                        src='/static/images/login-bg.jpg'
                        style={{
                            filter: 'brightness(0.4) blur(2px)',
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </Box>
            </Box>
        </>
    );
};
export default Login
