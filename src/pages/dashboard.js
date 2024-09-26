import Head from 'next/head';
import { Box, Container, Grid, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';

import { Balance } from '../components/dashboard/balance';
import { TransactionHistory } from '../components/dashboard/transaction-history';
import { Cashflow } from '../components/dashboard/cashflow';
import { Inflation } from '../components/dashboard/inflation';
import { Income } from '../components/dashboard/income';
import { Expenses } from '../components/dashboard/expenses';
import { ExpensesChart } from '../components/dashboard/expenses-chart';
import { DashboardLayout } from '../components/dashboard-layout';
import useGetUserTransactions from 'hooks/useGetUserTransactions';
import useGetUserSurvey from 'hooks/useGetUserSurvey';
import { useAuthStore } from 'stores/useAuthStore';
import { useTransactionStore } from 'stores/useTransactionStore';
import { useAccountStore } from 'stores/useAccountStore';
import { getLanguage } from 'utils/getLanguage';
import NewsPanel from 'components/news-panel';
import DashboardTour from 'components/tours/DashboardTour';
import { SavingsPanel } from 'components/dashboard/SavingsPanel';
import { InvestmentPanel } from 'components/dashboard/InvestmentPanel';


const Page = () => {
    const user = useAuthStore((state) => state.authState?.user);
    const getTourProgress = useAuthStore((state) => state.getTourProgress);
    const manageTourProgress = useAuthStore((state) => state.manageTourProgress);
    const userID = user?.uid || '';
    const [showTour, setShowTour] = useState(false);

    const transactions = useTransactionStore((state) => state.transactions);
    const isEmpty = useTransactionStore((state) => state.isEmpty);
    // GET USER TRANSACTIONS
    useGetUserTransactions(userID);
    useGetUserSurvey(userID);

    const tourSteps = [
        {
            target: '.dashboard_step_one',
            title: 'Balance',
            content: 'The amount of money present in all your accounts at any given moment',
            disableBeacon: true,
            placement: 'bottom'
        },
        {
            target: '.dashboard_step_two',
            title: 'Expenses',
            content:
                'are costs for items or resources that are used up or consumed in the course of daily living. Expenses recur (i.e., they happen over and over again) because food, housing, clothing, energy, and so on are used up on a daily basis',
            placement: 'bottom'
        },
        {
            target: '.dashboard_step_three',
            title: 'Income',
            content: 'is earned or received in a given period',
            disableBeacon: true,
            placement: 'bottom'
        },
        {
            target: '.dashboard_step_four',
            title: 'Inflation Rate',
            content: 'is the rate of increase in prices over a given period of time',
            placement: 'bottom'
        },
        {
            target: '.dashboard_step_five',
            title: 'Cashflow',
            content: 'the rate at which money goes into, or into and out of,a person',
            placement: 'bottom'
        },
        {
            target: '.dashboard_step_six',
            title: 'Expenses Chart',
            content: 'Shows the distribution of your expenses by categories in a donut chart.',
            placement: 'bottom'
        },
        {
            target: '.dashboard_step_seven',
            title: 'Transaction History',
            content: 'Shows the history of all your transactions (expenses or income)',
            placement: 'bottom'
        },
        {
            target: '.dashboard_step_eight',
            title: 'News',
            content: 'Shows the latest news about the financial world',
            placement: 'bottom'
        }
    ];

    const styles = {
        container: {
            width: {
                xs: '100%'
            },
            height: '100%',
            display: 'grid',
            placeItems: 'center',
            textAlign: {
                xs: 'center'
            },
            p: 2
        }
    };

    useEffect(() => {
        const currentTour = getTourProgress('dashboard');
        setShowTour(currentTour.isDone);
    }, []);

    if (transactions.length === 0 && !isEmpty) {
        return (
            <Box sx={styles.container}>
                <CircularProgress size={200} />
            </Box>
        );
    }

    if (isEmpty) {
        return (
            <Box sx={{ ...styles.container, alignContent: 'center' }}>
                <Box sx={{ fontSize: 80 }}>
                    <CreateIcon color='primary' fontSize='inherit' />
                </Box>
                <Typography variant='h5' mb={2}>
                    Create your first financial transaction
                </Typography>
                <Typography variant='body1' color='gray'>
                    Click the Add Transaction button to start monitoring your finances
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {transactions.length !== 0 && !showTour && (
                <DashboardTour
                    setShowTour={setShowTour}
                    tourSteps={tourSteps}
                    finishTour={() => manageTourProgress('dashboard')}
                />
            )}
            <Head>
                <title>CASH: Financial Monitoring Application</title>
                <link rel='manifest' href='/manifest.json' />
                <link rel='icon' href='/favicon.ico' type='image/png' />
            </Head>
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={false}>
                    <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                            {/* BALANCE PANEL */}
                            <Balance className='dashboard_step_one' />
                        </Grid>
                        <Grid item md={6} sm={6} xs={12}>
                            <Inflation className='dashboard_step_four' />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            {/* EXPENSE PANEL */}
                            <Expenses sx={{ height: '100%' }} className='dashboard_step_two' />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            {/* INCOME PANEL */}
                            <Income className='dashboard_step_three' />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            {/* EXPENSE PANEL */}
                            <SavingsPanel sx={{ height: '100%' }} className='dashboard_step_two' />
                        </Grid>
                        <Grid item xl={3} lg={3} sm={6} xs={12}>
                            {/* INCOME PANEL */}
                            <InvestmentPanel className='dashboard_step_three' />
                        </Grid>

                        <Grid item lg={8} md={12} xl={9} xs={12}>
                            {/* BAR CHART PANEl */}
                            <Cashflow className='dashboard_step_five' />
                        </Grid>
                        <Grid item lg={4} md={6} xl={3} xs={12}>
                            {/* EXPENSES GRAPH */}
                            <ExpensesChart sx={{ height: '100%' }} className='dashboard_step_six' />
                        </Grid>
                        <Grid item lg={4} md={6} xl={3} xs={12}>
                            {/* TRANSACTION HISTORY */}
                            <TransactionHistory sx={{ height: '100%' }} className='dashboard_step_seven' />
                        </Grid>
                        <Grid item lg={8} md={12} xl={9} xs={12}>
                            <NewsPanel className='dashboard_step_eight' />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
