import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import moment from 'moment/moment';

import { Clock as ClockIcon } from '../../icons/clock';
import Button from '@mui/material/Button';
import { theme } from 'theme';
import { formatPrice } from 'utils/format-price';
import Link from 'next/link';

import { Icon } from 'components/shared/Icon';
import { ICON_NAMES } from 'constants/constant';

export const AccountCard = ({ account, ...rest }) => {
    console.log({ account });
    return (
        <>
            <Card
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                }}
                {...rest}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2
                        }}
                    >
                        <Icon name={account.account_icon} sx={{ fontSize: '100px', color: account.account_color }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 4 }}>
                        <Typography color='textPrimary' gutterBottom variant='h6'>
                            {account.account_name}
                        </Typography>
                        <Typography color='textPrimary' gutterBottom variant='h6'>
                            {formatPrice(account.account_amount)}
                        </Typography>
                    </Box>
                    <Typography align='center' color='textPrimary' variant='body1'>
                        {account.account_description || 'No Description'}
                    </Typography>
                </CardContent>
                <Divider />
                <Box sx={{ p: 2 }}>
                    <Grid container spacing={2} sx={{ justifyContent: 'space-between' }}>
                        <Grid
                            item
                            sx={{
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <ClockIcon color='action' />
                            <Typography color='textSecondary' display='inline' sx={{ pl: 1 }} variant='body2'>
                                Last Used: {moment(account.timestamp).startOf('hour').fromNow()}
                            </Typography>
                        </Grid>
                        <Grid
                            item
                            sx={{
                                alignItems: 'center',
                                display: 'flex'
                            }}
                        >
                            <Link
                                href={{
                                    pathname: '/accounts/[accountId]',
                                    query: { accountId: account.id }
                                }}
                                key={account.id}
                            >
                                <Button>
                                    <Icon
                                        name={ICON_NAMES.SYSTEM_ICONS.EDIT}
                                        color='action'
                                        sx={{ fontSize: '20px' }}
                                    />
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </>
    );
};

AccountCard.propTypes = {
    product: PropTypes.object.isRequired
};
