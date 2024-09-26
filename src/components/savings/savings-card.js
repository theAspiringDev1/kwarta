import { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types'
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography, Link, Paper } from '@mui/material';
import Select from '@mui/material/Select';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import InfoIcon from '@mui/icons-material/Info';

import { Icon } from 'components/shared/Icon';
import { ICON_NAMES } from 'constants/constant';
import { formatPrice } from 'utils/format-price';

import { getLanguage } from 'utils/getLanguage';
import { useLanguageStore } from 'stores/useLanguageStore';

import DealsCard from './deals-card';

import { bdoSavings, metrobankSavings, bpiSavings, landbankSavings, securitybankSavings } from '../../data/savings';
import { useAccountStore } from 'stores/useAccountStore';

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 150,
            width: 250
        }
    }
};

export const SavingsCard = ({ ...rest }) => {
    const [selectedAccount, setSelectedAccount] = useState('');
    const [amount, setAmount] = useState(0);
    const [savings, setSavings] = useState('');

    const accounts = useAccountStore((state) => state.accounts);

    const currentLanguage = useLanguageStore((state) => state.currentLanguage);

    const handleAccountChange = (e) => {
        const currentAccountId = e.target.value;
        const currentAccount = accounts.find((account) => account.id === currentAccountId);

        setAmount(currentAccount.account_amount);
        setSelectedAccount(e.target.value);
    };

    useEffect(() => {
        const sortedBdoSavings = bdoSavings.filter((item) => amount >= item.balanceInterest);
        const sortedMetrobankSavings = metrobankSavings.filter((item) => amount >= item.balanceInterest);
        const sortedBpiSavings = bpiSavings.filter((item) => amount >= item.balanceInterest);
        const sortedLandbankSavings = landbankSavings.filter((item) => amount >= item.balanceInterest);
        const sortedSecuritybankSavings = securitybankSavings.filter((item) => amount >= item.balanceInterest);

        function computeInterest(productName, interestRate, currentAmount) {
            const total = (currentAmount * Math.pow(1 + interestRate / 100, 5)).toFixed(2);
            const percent = (((total - currentAmount) / currentAmount) * 100).toFixed(2);
            return { productName, total, percent };
        }

        const computedBdoSavings = sortedBdoSavings.map((item) =>
            computeInterest(item.productName, item.interestRate, amount)
        );
        const computedMetrobankSavings = sortedMetrobankSavings.map((item) =>
            computeInterest(item.productName, item.interestRate, amount)
        );
        const computedBpiSavings = sortedBpiSavings.map((item) =>
            computeInterest(item.productName, item.interestRate, amount)
        );
        const computedLandbankSavings = sortedLandbankSavings.map((item) =>
            computeInterest(item.productName, item.interestRate, amount)
        );
        const computedSecuritybankSavings = sortedSecuritybankSavings.map((item) =>
            computeInterest(item.productName, item.interestRate, amount)
        );

        console.log(computedBpiSavings);

        setSavings({
            computedBdoSavings,
            computedMetrobankSavings,
            computedBpiSavings,
            computedLandbankSavings,
            computedSecuritybankSavings
        });

        console.log(savings);
    }, [selectedAccount]);

    const SuggestionBlock = () => (
        <Box sx={{ pt: 3 }}>
            <Typography align='center' sx={{ m: 1 }} variant='h6'>
                {getLanguage(currentLanguage).amountSavingsPart1}
                {formatPrice(amount, true)}
                {getLanguage(currentLanguage).amountSavingsPart2}
            </Typography>
            <Box sx={{ pt: 3, flexGrow: 1 }}>
                <Typography sx={{ m: 1 }} variant='h5'>
                    BDO
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} mb={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {savings.computedBdoSavings?.map((savings) => (
                        <Grid item key={savings.id} xs={12} sm={4} md={4}>
                            <DealsCard iconName={ICON_NAMES.ACCOUNT_ICONS.BANK} savings={savings} bankName='BDO'/>
                        </Grid>
                    ))}
                </Grid>
                <Link href='https://www.bdo.com.ph/personal' target='_blank'>
                    <Typography sx={{ m: 1, textAlign: 'center' }} variant='body1'>
                        For more information about BDO Savings Accounts. Click here.
                    </Typography>
                </Link>
            </Box>

            <Box sx={{ pt: 3, flexGrow: 1 }}>
                <Typography sx={{ m: 1 }} variant='h5'>
                    Metrobank
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} mb={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {savings.computedMetrobankSavings?.map((savings) => (
                        <Grid item key={savings.id} xs={12} sm={4} md={4}>
                            <DealsCard iconName={ICON_NAMES.ACCOUNT_ICONS.BANK} savings={savings} bankName='Metrobank'/>
                        </Grid>
                    ))}
                </Grid>
                <Link href='https://www.metrobank.com.ph/save/savings' target='_blank'>
                    <Typography sx={{ m: 1, textAlign: 'center' }} variant='body1'>
                        For more information about Metrobank Savings Accounts. Click here.
                    </Typography>
                </Link>
            </Box>

            <Box sx={{ pt: 3, flexGrow: 1 }}>
                <Typography sx={{ m: 1 }} variant='h5'>
                    BPI
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} mb={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {savings.computedBpiSavings?.map((savings) => (
                        <Grid item key={savings.id} xs={12} sm={4} md={4}>
                            <DealsCard iconName={ICON_NAMES.ACCOUNT_ICONS.BANK} savings={savings} bankName='BPI'/>
                        </Grid>
                    ))}
                </Grid>
                <Link href='https://www.bpi.com.ph/personal/bank/savings-accounts' target='_blank'>
                    <Typography sx={{ m: 1, textAlign: 'center' }} variant='body1'>
                        For more information about BPI Savings Accounts. Click here.
                    </Typography>
                </Link>
            </Box>

            <Box sx={{ pt: 3, flexGrow: 1 }}>
                <Typography sx={{ m: 1 }} variant='h5'>
                    Landbank
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} mb={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {savings.computedLandbankSavings?.map((savings) => (
                        <Grid item key={savings.id} xs={12} sm={4} md={4}>
                            <DealsCard iconName={ICON_NAMES.ACCOUNT_ICONS.BANK} savings={savings} bankName='Landbank'/>
                        </Grid>
                    ))}
                </Grid>
                <Link href='https://www.landbank.com/cards' target='_blank'>
                    <Typography sx={{ m: 1, textAlign: 'center' }} variant='body1'>
                        For more information about Landbank Savings Accounts. Click here.
                    </Typography>
                </Link>
            </Box>

            <Box sx={{ pt: 3, flexGrow: 1 }}>
                <Typography sx={{ m: 1 }} variant='h5'>
                    Security Bank
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} mb={4} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {savings.computedSecuritybankSavings?.map((savings) => (
                        <Grid item key={savings.id} xs={12} sm={4} md={4}>
                            <DealsCard iconName={ICON_NAMES.ACCOUNT_ICONS.BANK} savings={savings} bankName='Security Bank'/>
                        </Grid>
                    ))}
                </Grid>
                <Link href='https://www.securitybank.com/' target='_blank'>
                    <Typography sx={{ m: 1, textAlign: 'center' }} variant='body1'>
                        For more information about Security Bank Savings Accounts. Click here.
                    </Typography>
                </Link>
            </Box>
            <Box sx={{ pt: 3 }}>
                <Typography variant='h6' mb={2} color='primary'>
                    DISCLAIMERS
                </Typography>
                <Typography variant='body1' mb={4} color='primary'>
                    This calculation is for illustration purposes only and should not be able to taken as professional
                    advice to invest in these saving accounts. It should not be used as the sole basis to measure
                    returns in said securities. Interest rates and amounts are subject to change. For more information,
                    you can go to the bank's website or go to the nearest branch in your area.
                </Typography>
            </Box>
            <Box sx={{ pt: 3 }}>
                <Typography variant='body1' mt={4} color='black'>
                    Source:{' '}
                    <Typography component='a' target='_blank' href='https://grit.ph/savings-account/'>
                        Grit PH
                    </Typography>
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            <Box
                sx={{
                    justifyContent: 'center',
                    mb: 2
                }}
            >
                <Box sx={{ py: 4, px: 4, mx: 'auto', width: '100%' }}>
                    <Box sx={{ fontSize: 80, textAlign: 'center' }}>
                        <InfoIcon fontSize='inherit' />
                    </Box>
                    <Typography align='center' sx={{ m: 1, textAlign: 'center' }} variant='body1'>
                        {getLanguage(currentLanguage).savingsIntroPart1} <br></br>
                        {getLanguage(currentLanguage).savingsIntroPart2}
                    </Typography>
                </Box>

                <Box sx={{ py: 4, px: 4, mx: 'auto', width: '100%' }}>
                    <Typography align='center' sx={{ m: 1, textAlign: 'center', fontWeight: 'bold' }} variant='body1'>
                        {getLanguage(currentLanguage).selectAccountSavings}
                    </Typography>
                    <Select
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        value={selectedAccount}
                        label='Select Account'
                        onChange={handleAccountChange}
                        sx={{ display: 'flex', alignItems: 'center', maxWidth: 400, mx: 'auto' }}
                        MenuProps={MenuProps}
                        placeholder='Select Account'
                        className='savings_step_three'
                    >
                        {accounts.map((account) => {
                            return (
                                <MenuItem key={account.id} value={account.id}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <ListItemIcon>
                                            <Icon name={account.account_icon} />
                                        </ListItemIcon>
                                        <ListItemText>{account.account_name}</ListItemText>
                                    </Box>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </Box>
            </Box>

            {selectedAccount === '' ? null : amount > 1999 ? (
                <SuggestionBlock />
            ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography sx={{ fontSize: 100 }}>😅</Typography>
                    <Typography sx={{ m: 1, textAlign: 'center' }} variant='h6'>
                        {getLanguage(currentLanguage).insufficientAmountSavings.split('.')[0]}
                    </Typography>
                    <Typography sx={{ m: 1, textAlign: 'center' }} variant='h5'>
                        {getLanguage(currentLanguage).insufficientAmountSavings.split('.')[1]}
                    </Typography>
                </Paper>
            )}
        </>
    );
};

SavingsCard.propTypes = {
    product: PropTypes.object.isRequired
}
