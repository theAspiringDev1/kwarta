import { useEffect, useState } from 'react';
import { onSnapshot, collection, orderBy, query, where } from 'firebase/firestore';
import { useTransactionStore } from 'stores/useTransactionStore';

import { db } from '../../firebase.config';
import { useAuthStore } from 'stores/useAuthStore';

export default function useGetUserTransactions() {
    const setTransactions = useTransactionStore((state) => state.setTransactions);
    const userID = useAuthStore((state) => state.authState.user.uid);
    const transactionColRef = collection(db, 'transactions');
    const transactionQuery = query(transactionColRef, where('user_id', '==', userID), orderBy('timestamp', 'desc'));

    useEffect(() => {
        const unsubscribe = onSnapshot(transactionQuery, (snapshotData) => {
            const dataList = [];
            snapshotData.forEach((doc) => dataList.push({ ...doc.data(), id: doc.id }));

            // console.log(dataList);
            setTransactions(dataList);
        });

        return unsubscribe;
    }, []);
}
