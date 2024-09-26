import { useEffect, useState } from 'react';
import { Avatar, Box, Card, CardContent, Grid, Typography, Tooltip, Button, Paper } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BalanceIcon from '@mui/icons-material/Balance';
import { getLanguage } from 'utils/getLanguage';
import { useAccountStore } from 'stores/useAccountStore';
import { formatPrice } from 'utils/format-price';
import { useLanguageStore } from 'stores/useLanguageStore';
import { blue, deepPurple } from '@mui/material/colors';
import { useTransactionStore } from 'stores/useTransactionStore';
import { ICON_NAMES } from 'constants/constant';
import { Icon } from 'components/shared/Icon';

export const Balance = (props) => {
    const accounts = useAccountStore((state) => state.accounts);
    const transactions = useTransactionStore((state) => state.transactions);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);

    const [total, setTotal] = useState(0);
    const [accountAllocation, setAccountAllocation] = useState([]);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const totalBalance = accounts.reduce((acc, current) => {
            acc += current.account_amount;
            return acc;
        }, 0);

        const savingsAndInvestmentsTotal = transactions
            .filter((transaction) => transaction.type === 'savings' || transaction.type === 'investments')
            .reduce((acc, current) => {
                acc += current.amount;
                return acc;
            }, 0);

        console.log({ savingsAndInvestmentsTotal });

        setTotal(totalBalance + savingsAndInvestmentsTotal);

        const accountDistribution = accounts.map((account) => ({
            name: account.account_name,
            amount: account.account_amount,
            width: Math.floor((account.account_amount / (totalBalance + savingsAndInvestmentsTotal)) * 100),
            color: account.account_color,
            icon: account.account_icon
        }));

        const savingsPart = {
            name: 'Savings and Investments',
            amount: savingsAndInvestmentsTotal,
            width: Math.ceil((savingsAndInvestmentsTotal / (totalBalance + savingsAndInvestmentsTotal)) * 100),
            color: deepPurple[500],
            icon: ICON_NAMES.CATEGORY_ICONS.SAVINGS
        };

        console.log({ accountDistribution: [...accountDistribution, savingsPart] });
        setAccountAllocation([...accountDistribution, savingsPart]);
    }, [accounts, transactions]);

    return (
        <Card sx={{ height: '100%' }} {...props}>
            <CardContent>
                <Grid container sx={{ justifyContent: 'space-between', gap: 2 }}>
                    <Grid item>
                        <Typography color='textSecondary' gutterBottom variant='overline'>
                            {getLanguage(currentLanguage).balance}
                        </Typography>
                        <Typography color='textPrimary' variant='h4' sx={{ whiteSpace: 'nowrap' }}>
                            {formatPrice(total, true)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title={getLanguage(currentLanguage).tooltipTotalBalance}>
                            <Avatar
                                sx={{
                                    backgroundColor: blue[500],
                                    height: 56,
                                    width: 56
                                }}
                            >
                                <BalanceIcon />
                            </Avatar>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                overflow: 'hidden',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                        >
                            {accountAllocation.length !== 0 &&
                                accountAllocation.map((account) => (
                                    <Tooltip title={`${account.name}: ${formatPrice(account.amount, true)}`}>
                                        <Box
                                            sx={{
                                                width: `${account.width}%`,
                                                height: 10,
                                                background: account.color,
                                                display: 'inline-block'
                                            }}
                                        ></Box>
                                    </Tooltip>
                                ))}
                        </Box>
                    </Grid>
                    <Button
                        variant='text'
                        sx={{ display: 'flex', alignItems: 'center', my: 2, cursor: 'pointer', gap: 2, p: 1 }}
                        onClick={() => setShowDetails(!showDetails)}
                    >
                        {showDetails ? (
                            <>
                                <VisibilityOffIcon />
                                Hide Details
                            </>
                        ) : (
                            <>
                                <VisibilityIcon />
                                Show Details
                            </>
                        )}
                    </Button>

                    {showDetails && (
                        <Grid item container sx={{ height: 125, overflowY: 'auto' }}>
                            {accountAllocation.map((account) => (
                                <Grid item sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
                                    <Box sx={{ color: account.color, display: 'flex', alignItems: 'center', mr: 1 }}>
                                        <Icon name={account.icon} color='inherit' />
                                    </Box>
                                    <Typography variant='h6'>{account.name}</Typography>
                                    <Typography variant='h6' sx={{ ml: 'auto' }}>
                                        {formatPrice(account.amount, true)}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};
