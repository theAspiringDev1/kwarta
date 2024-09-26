import { useEffect, useState } from 'react';
import { Avatar, Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { getLanguage } from '../../utils/getLanguage';
import { useTransactionStore } from 'stores/useTransactionStore';
import { formatPrice } from 'utils/format-price';
import { useLanguageStore } from 'stores/useLanguageStore';
import { deepPurple, yellow } from '@mui/material/colors';
import { useAccountStore } from 'stores/useAccountStore';

export const SavingsPanel = (props) => {
    const transactions = useTransactionStore((state) => state.transactions);
    const [total, setTotal] = useState(0);
    const accounts = useAccountStore((state) => state.accounts);
    const currentLanguage = useLanguageStore((state) => state.currentLanguage);

    useEffect(() => {
        const totalSavings = transactions.reduce((acc, current) => {
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

        setTotal(totalSavings + totalAccountSavings);
    }, [transactions]);

    return (
        <Card {...props}>
            <CardContent>
                <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
                    <Grid item>
                        <Typography color='textSecondary' gutterBottom variant='overline'>
                            Savings
                        </Typography>
                        <Typography color='textPrimary' variant='h4'>
                            {formatPrice(total)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title={getLanguage(currentLanguage).tooltipTotalExpense}>
                            <Avatar
                                sx={{
                                    backgroundColor: deepPurple[400],
                                    height: 56,
                                    width: 56
                                }}
                            >
                                <SavingsIcon />
                            </Avatar>
                        </Tooltip>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
