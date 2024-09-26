import Head from 'next/head';
import { Box, Container, Grid, Tooltip, Typography } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';

import useGetUserTransactions from 'hooks/useGetUserTransactions';
import { useEffect } from 'react';
import { useAuthStore } from 'stores/useAuthStore';
import { DashboardLayout } from 'components/dashboard-layout';
import { ExpensesChart } from 'components/dashboard/expenses-chart';
import { Cashflow } from 'components/dashboard/cashflow';
import { IncomeChart } from 'components/dashboard/income-chart';
import { useTransactionStore } from 'stores/useTransactionStore';
import { getLanguage } from 'utils/getLanguage';
import { useLanguageStore } from 'stores/useLanguageStore';
import { ExpenseTypeChart } from 'components/ExpenseTypeChart';

const Page = () => {
    const transactions = useTransactionStore((state) => state.transactions);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
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
    return (
        <>
            <Head>
                <title>Cashflow</title>
            </Head>
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth={false}>
                    {transactions.length !== 0 ? (
                        <>
                            <Tooltip title={getLanguage(currentLanguage).tooltipCashflow}>
                                <Typography variant='h3' sx={{ width: 'max-content', mb: 2 }}>
                                    {getLanguage(currentLanguage).cashflow}
                                </Typography>
                            </Tooltip>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <ExpenseTypeChart />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <ExpensesChart />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <IncomeChart />
                                </Grid>
                            </Grid>
                            <Cashflow />
                        </>
                    ) : (
                        <Box sx={{ ...styles.container, alignContent: 'center', mt: 10 }}>
                            <Box sx={{ fontSize: 80 }}>
                                <CreateIcon color='primary' fontSize='inherit' />
                            </Box>
                            <Typography variant='h5' mb={2}>
                                Create your Transactions
                            </Typography>
                            <Typography variant='body1' color='gray'>
                                Click the Add Transactions button to start monitoring your cashflow
                            </Typography>
                        </Box>
                    )}
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
