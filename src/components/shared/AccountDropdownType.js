import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function AccountDropdownType({ handleChange, accountType, disabled }) {
    return (
        <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Account Type</InputLabel>
            <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={accountType}
                label='Account Type'
                onChange={handleChange}
                disabled={disabled}
            >
                <MenuItem value='cash-on-hand'>Cash on Hand</MenuItem>
                <MenuItem value='e-wallet'>E-Wallet</MenuItem>
                <MenuItem value='savings-1'>Personal Savings Account</MenuItem>
                <MenuItem value='savings-2'>Business Savings Account</MenuItem>
                <MenuItem value='investments'>Investment Account</MenuItem>
            </Select>
        </FormControl>
    );
}
