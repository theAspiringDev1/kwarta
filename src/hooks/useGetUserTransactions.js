import { useEffect, useState } from 'react';
import { onSnapshot, collection, orderBy, query, where } from 'firebase/firestore';
import { useTransactionStore } from 'stores/useTransactionStore';

import { db } from '../../firebase.config';
import { useAuthStore } from 'stores/useAuthStore';

export default function useGetUserTransactions(userID) {
    const setTransactions = useTransactionStore((state) => state.setTransactions);

    useEffect(() => {
        if (!userID) return;
        const transactionColRef = collection(db, 'transactions');
        const transactionQuery = query(transactionColRef, where('user_id', '==', userID), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(transactionQuery, (snapshotData) => {
            const dataList = [];
            const isEmpty = snapshotData.docs.length === 0;
            snapshotData.forEach((doc) => dataList.push({ ...doc.data(), id: doc.id }));

            // console.log(dataList);
            setTransactions(dataList, isEmpty);
        });

        return unsubscribe;
    }, []);
}
