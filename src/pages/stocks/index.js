import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, CircularProgress, Container, Grid, Paper, Tooltip, Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { DashboardLayout } from '../../components/dashboard-layout';
import { formatPrice } from 'utils/format-price';
import Link from 'next/link';
import { useStocks } from 'hooks/swr/useStocks';
import NewsPanel from 'components/news-panel';
import { useAuthStore } from 'stores/useAuthStore';
import DashboardTour from 'components/tours/DashboardTour';
import { getLanguage } from 'utils/getLanguage';
import { useLanguageStore } from 'stores/useLanguageStore';


const Page = () => {
    const router = useRouter();
    const { data: stockData, isError, isLoading } = useStocks();

    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
    const getTourProgress = useAuthStore((state) => state.getTourProgress);
    const manageTourProgress = useAuthStore((state) => state.manageTourProgress);
    const [showTour, setShowTour] = useState(false);

    const tourSteps = [
        {
            target: '.stocks_step_one',
            title: 'Stocks',
            content: `A stock, also known as equity, is a security that represents the ownership of a fraction of the issuing corporation. Units of stock are called "shares" which entitles the owner to a proportion of the corporation's assets and profits equal to how much stock they own.  `,
            disableBeacon: true,
            placement: 'bottom'
        },
        {
            target: '.stocks_step_two',
            title: 'Stocks List',
            content: 'Displays the market prices for different stocks.',
            placement: 'bottom'
        },
        {
            target: '.stocks_step_three',
            title: 'Latest News',
            content: `Displays the latest news about the financial world.`,
            placement: 'bottom'
        },
        {
            target: '.stocks_step_four',
            title: 'Stocks Recommendations',
            content: `Displays the stocks that you might want to invest in`,
            placement: 'bottom'
        },
        {
            target: '.stocks_step_five',
            title: 'Top Stocks',
            content: `Displays the market movers in the stock market. `,
            placement: 'bottom'
        }
    ];

    useEffect(() => {
        const currentTour = getTourProgress('stocks');
        setShowTour(currentTour.isDone);
    }, []);

    return (
        <>
            {!showTour && (
                <DashboardTour
                    setShowTour={setShowTour}
                    tourSteps={tourSteps}
                    finishTour={() => manageTourProgress('stocks')}
                />
            )}
            <Head>
                <title>Stocks |</title>
            </Head>
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth='lg'>
                    <Typography variant='h4' mb={3} className='stocks_step_one'>
                        Stocks
                        {/* <Typography variant='body1' sx={{ display: 'block' }}>
                            View the condition of the Stock Market
                        </Typography> */}
                    </Typography>

                    <Typography variant='body1' mb={2} sx={{ textIndent: 50 }}>
                        {getLanguage(currentLanguage).stocksDescriptionOne}
                    </Typography>
                    <Typography variant='body1' sx={{ textIndent: 50, mb: 5 }}>
                        {getLanguage(currentLanguage).stocksDescriptionTwo}
                    </Typography>
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} className='stocks_step_two'>
                            <iframe
                                src='https://www.pesobility.com/stock?sort=prevYrCashDivPerc'
                                frameborder='1'
                                width='100%'
                                height='400'
                            ></iframe>
                        </Grid>
                    </Grid>

                    <Box mb={4} className='stocks_step_three'>
                        <NewsPanel />
                    </Box>

                    {/* SUGGESTIONS */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} className='stocks_step_four'>
                            <Tooltip title={getLanguage(currentLanguage).tooltipStocksSuggestion}>
                                <Typography variant='h4' sx={{ width: 'max-content' }}>
                                    {getLanguage(currentLanguage).stockSuggestion}
                                </Typography>
                            </Tooltip>
                        </Grid>

                        {!isLoading && !isError ? (
                            stockData.trendingStocks.map((item, i) => (
                                <Grid item xs={12} md={4} key={item.company + '-' + i}>
                                    <Link href={{ pathname: `/stocks/calculate`, query: { ...item } }}>
                                        <Paper sx={{ p: 2, display: 'grid', gap: 2, justifyItems: 'start' }}>
                                            <Button sx={{ p: 0 }} variant='text' href={item.link} target='_blank'>
                                                {item.company}
                                            </Button>

                                            <Typography variant='h6'>{formatPrice(item.price, true)}</Typography>
                                            <Typography variant='body2' sx={{ display: 'flex', gap: 4 }}>
                                                <Typography
                                                    variant='body2'
                                                    color={item.priceIncrease.includes('-') ? 'error' : green[500]}
                                                >
                                                    {item.priceIncrease}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    color={item.pricePercentage.includes('-') ? 'error' : green[500]}
                                                >
                                                    {item.pricePercentage}
                                                </Typography>
                                            </Typography>
                                        </Paper>
                                    </Link>
                                </Grid>
                            ))
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                    p: 2
                                }}
                            >
                                {!isError ? (
                                    <CircularProgress size={50} />
                                ) : (
                                    <Typography variant='h6' my={4}>
                                        Error fetching stocks 🥲
                                    </Typography>
                                )}
                            </Box>
                        )}

                        <Grid item>
                            <Typography variant='body1'>
                                This data is originally from{' '}
                                <Typography
                                    variant='body1'
                                    component='a'
                                    href='https://ph.investing.com/equities/trending-stocks'
                                    target='_blank'
                                >
                                    ph.investing.com
                                </Typography>
                                . Visit their website for more information.
                            </Typography>
                        </Grid>
                    </Grid>
                    {/* MARKET MOVERS */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} className='stocks_step_five'>
                            <Tooltip title={getLanguage(currentLanguage).tooltipMarketMovers}>
                                <Typography variant='h4' sx={{ width: 'max-content' }}>
                                    {getLanguage(currentLanguage).stockMarketMovers}
                                </Typography>
                            </Tooltip>
                        </Grid>

                        {!isLoading ? (
                            stockData.marketMovers.map((item, i) => (
                                <Grid item xs={12} md={4} key={item.company + '-' + i}>
                                    <Link href={{ pathname: `/stocks/calculate`, query: { ...item } }}>
                                        <Paper sx={{ p: 2, display: 'grid', gap: 2, justifyItems: 'start' }}>
                                            <Button sx={{ p: 0 }} variant='text' href={item.link} target='_blank'>
                                                {item.company}
                                            </Button>

                                            <Typography variant='h6'>{formatPrice(item.price, true)}</Typography>
                                            <Typography variant='body2' sx={{ display: 'flex', gap: 4 }}>
                                                <Typography
                                                    variant='body2'
                                                    color={item.pricePercentage.includes('-') ? 'error' : green[500]}
                                                >
                                                    {item.pricePercentage}
                                                </Typography>
                                            </Typography>
                                            <Typography variant='body2'>{item.volume}</Typography>
                                        </Paper>
                                    </Link>
                                </Grid>
                            ))
                        ) : (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    width: '100%',
                                    p: 2
                                }}
                            >
                                <CircularProgress size={50} />
                            </Box>
                        )}

                        <Grid item xs={12}>
                            <Typography variant='body1'>
                                This data is originally from{' '}
                                <Typography
                                    variant='body1'
                                    component='a'
                                    href='https://ph.investing.com/equities/trending-stocks'
                                    target='_blank'
                                >
                                    ph.investing.com
                                </Typography>
                                . Visit their website for more information.
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
