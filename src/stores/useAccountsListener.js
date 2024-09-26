import { useEffect } from 'react';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase.config';

import { useAccountStore } from 'stores/useAccountStore';

const useAccountsListener = (userID) => {
    const accountColRef = collection(db, 'accounts');
    const setAccounts = useAccountStore((state) => state.setAccounts);

    useEffect(() => {
        if (!userID) {
            return;
        }
        const accountQuery = query(accountColRef, where('user_id', '==', userID));

        const unsubscribe = onSnapshot(accountQuery, (snapshotData) => {
            const userAccounts = [];
            snapshotData.forEach((doc) => {
                userAccounts.push({
                    account_color: doc.data().account_color,
                    account_icon: doc.data().account_icon,
                    account_name: doc.data().account_name,
                    account_amount: doc.data().account_amount,
                    account_description: doc.data().account_description,
                    account_type: doc.data().account_type,
                    user_id: userID || '1',
                    id: doc.id,
                    timestamp: doc.data().timestamp?.toDate() || ''
                });
            });
            setAccounts(userAccounts);
        });
        return unsubscribe;
    }, [userID]);
};

export default useAccountsListener;
