import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme, Tooltip, Grid } from '@mui/material';
import { getLanguage } from 'utils/getLanguage';
import { useTransactionStore } from 'stores/useTransactionStore';
import { useEffect, useState } from 'react';
import { useAuthStore } from 'stores/useAuthStore';
import { Icon } from '../components/shared/Icon';
import { formatPrice } from 'utils/format-price';
import { useLanguageStore } from 'stores/useLanguageStore';
import { blue, green, red, yellow } from '@mui/material/colors';

import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { validateYupSchema } from 'formik';
import PlaceholderEmpty from './shared/PlaceholderEmpty';
import { useAccountStore } from 'stores/useAccountStore';

export const ExpenseTypeChart = (props) => {
    const theme = useTheme();
    const user = useAuthStore((state) => state.authState?.user);
    const userSurvey = useAuthStore((state) => state.authState.userSurvey);
    const transactions = useTransactionStore((state) => state.transactions);
    const [graphData, setGraphData] = useState('');
    const [categoryList, setCategoryList] = useState('');
    const [prompt, setPrompt] = useState('');
    const [expenseList, setExpenseList] = useState([]);
    const [isPositive, setIsPositive] = useState('');
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
    const accounts = useAccountStore((state) => state.accounts);

    const getExpenseTypeList = useTransactionStore((state) => state.getExpenseTypeList);
    const getExpenseList = useTransactionStore((state) => state.getExpenseList);

    const options = {
        animation: false,
        cutoutPercentage: 80,
        layout: { padding: 0 },
        legend: {
            display: false
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
            backgroundColor: theme.palette.background.paper,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    };

    useEffect(() => {
        if (!user) return;
        else {
            const expenseData = getExpenseTypeList(user?.uid);
            const expenseDataList = getExpenseList(user?.uid);
            setExpenseList(expenseDataList);
            const transactionSavings = transactions.reduce((acc, current) => {
                if (current.type === 'savings') {
                    acc += current.amount;
                }
                return acc;
            }, 0);
            const totalAccountSavings = accounts.reduce((acc, current) => {
                if (current.account_type === 'savings' || current.account_type.toLowerCase().includes('savings')) {
                    acc += current.account_amount;
                }
                return acc;
            }, 0);

            const totalSavings = transactionSavings + totalAccountSavings;

            const data = {
                datasets: [
                    {
                        data: [expenseData[0].amount, expenseData[1].amount, totalSavings],
                        backgroundColor: expenseData.map((item) => item.color),
                        borderWidth: 8,
                        borderColor: '#FFFFFF',
                        hoverBorderColor: '#FFFFFF'
                    }
                ],
                labels: ['Needs', 'Wants', 'Savings']
            };

            const total = expenseData.map((item) => item.amount).reduce((acc, cur) => (acc += cur), 0) + totalSavings;

            const percentageList = expenseData.map((item) => {
                return {
                    title: item.name,
                    value: (item.amount / total).toLocaleString(undefined, {
                        style: 'percent',
                        minimumFractionDigits: 2
                    }),
                    icon: item.icon,
                    color: item.color
                };
            });

            percentageList[2].value = (totalSavings / total).toLocaleString(undefined, {
                style: 'percent',
                minimumFractionDigits: 2
            });

            // console.log({ percentageList });

            const savings = (totalSavings / total) * 100;

            if (userSurvey.financeRule.needs <= 100 && userSurvey.financeRule.needs > 80) {
                setPrompt('Continue supporting your needs. If you have extra, you can save it for the future');
                setIsPositive(true);
            } else if (userSurvey.financeRule.wants <= 100 && userSurvey.financeRule.wants > 80) {
                setPrompt('You spend too much on your wants. Try saving for your future');
                setIsPositive(false);
            } else if (userSurvey.financeRule.wants < 80 && userSurvey.financeRule.needs < 80) {
                if (savings < userSurvey.financeRule.savings - 2.01) {
                    setPrompt("You're spending a lot for your account. You must save for your savings");
                    setIsPositive(false);
                } else if (
                    savings <= userSurvey.financeRule.savings - 0.01 &&
                    savings >= userSurvey.financeRule.savings - 2
                ) {
                    setPrompt("You're making good progress. You need to save more");
                    setIsPositive(true);
                } else if (savings > userSurvey.financeRule.savings) {
                    if (savings >= userSurvey.financeRule.savings + 20) {
                        setPrompt('You might want to diversify your savings');
                        setIsPositive(true);
                    } else {
                        setPrompt("You've made a good decision. Continue saving.");
                        setIsPositive(true);
                    }
                }
            }
            setGraphData(data);
            setCategoryList(percentageList);
        }
    }, [transactions]);

    return (
        <Card {...props}>
            <CardHeader title='Budget Distribution' sx={{ width: 'max-content' }} />
            <Divider />
            <CardContent>
                <Box
                    sx={{
                        height: 300,
                        position: 'relative',
                        mb: 4
                    }}
                >
                    {expenseList.length !== 0 ? (
                        <Doughnut data={graphData} options={options} />
                    ) : (
                        <PlaceholderEmpty message='No Expenses at the moment' />
                    )}
                </Box>
                <Grid container spacing={1}>
                    {expenseList.length !== 0 &&
                        categoryList.map(({ color, title, value, icon }) => (
                            <Grid
                                item
                                key={title}
                                sx={{
                                    color,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    width: '30%',
                                    p: 1
                                }}
                                xs={4}
                            >
                                <Icon name={icon} color='inherit' fontSize='large' />
                                <Typography color='textPrimary' variant='caption'>
                                    {title}
                                </Typography>
                                <Typography style={{ color }} variant='body1'>
                                    {value}
                                </Typography>
                            </Grid>
                        ))}
                </Grid>
                <Divider />
                {expenseList.length !== 0 && (
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        {isPositive ? (
                            <SentimentVerySatisfiedIcon color='success' fontSize='large' />
                        ) : (
                            <SentimentVeryDissatisfiedIcon color='error' fontSize='large' />
                        )}
                        <Typography color='textPrimary' variant='caption'>
                            {prompt}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};
