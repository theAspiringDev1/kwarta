import { useEffect, useState } from 'react';
import { Avatar, Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import InvestmentIcon from '@mui/icons-material/StackedLineChart';
import { getLanguage } from '../../utils/getLanguage';
import { useTransactionStore } from 'stores/useTransactionStore';
import { formatPrice } from 'utils/format-price';
import { useLanguageStore } from 'stores/useLanguageStore';
import { teal } from '@mui/material/colors';
import { useAccountStore } from 'stores/useAccountStore';

export const InvestmentPanel = (props) => {
    const transactions = useTransactionStore((state) => state.transactions);
    const [total, setTotal] = useState(0);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);
    const accounts = useAccountStore((state) => state.accounts);

    useEffect(() => {
        const totalInvestments = transactions.reduce((acc, current) => {
            if (current.type === 'investments') {
                acc += current.amount;
            }
            return acc;
        }, 0);

        const totalInvestmentAccounts = accounts.reduce((acc, current) => {
            if (current.account_type === 'investments') {
                acc += current.account_amount;
            }
            return acc;
        }, 0);

        setTotal(totalInvestments + totalInvestmentAccounts);
    }, [transactions]);

    return (
        <Card {...props}>
            <CardContent>
                <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                    <Grid item>
                        <Typography color='textSecondary' gutterBottom variant='overline'>
                            Investments
                        </Typography>
                        <Typography color='textPrimary' variant='h4'>
                            {formatPrice(total)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title={getLanguage(currentLanguage).tooltipTotalExpense}>
                            <Avatar
                                sx={{
                                    backgroundColor: teal[500],
                                    height: 56,
                                    width: 56
                                }}
                            >
                                <InvestmentIcon />
                            </Avatar>
                        </Tooltip>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
