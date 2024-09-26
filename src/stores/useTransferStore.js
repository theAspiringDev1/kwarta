import { create } from 'zustand';

import { addDoc, collection, serverTimestamp, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { db, storage } from '../../firebase.config';

const transferStore = (set,get) => ({
    transfers: [],
    getTransfer: () => {},
    setTransfers: (data) => set({ transfers: data }),
    createTransfer: async (newTransfer, currentFile) => {
        const loader = toast.loading('Creating Transfer');
        try {
            const receiverAccountRef = doc(db, "accounts", newTransfer.targetReceiverAccount.id);
            const senderAccountRef = doc(db, "accounts", newTransfer.targetSenderAccount.id);
            const receiverAccountResponse = await getDoc(receiverAccountRef);
            const senderAccountResponse = await getDoc(senderAccountRef);

            const receiverAccount = receiverAccountResponse.data();
            const senderAccount = senderAccountResponse.data();

            // UPLOAD IMAGE
            let fileUrl, fileRefName;
            if (currentFile) {
                fileRefName = `transfers/${uuidv4()}-${currentFile.name}`;
                const imageRef = ref(storage, fileRefName);

                const fileUpload = await uploadBytes(imageRef, currentFile);
                fileUrl = await getDownloadURL(fileUpload.ref);
                console.log('UPLOADED');
            }

            await updateDoc(senderAccountRef, {
                account_amount: senderAccount.account_amount - newTransfer.amount
            });
            await updateDoc(receiverAccountRef, {
                account_amount: receiverAccount.account_amount + newTransfer.amount
            });

            await addDoc(collection(db, 'transfers'), {
                ...newTransfer,
                photoRef: fileRefName || '',
                photoUrl: fileUrl || '',
                timestamp: serverTimestamp()
            });
            console.log('NEW DOCUMENT CREATED');
            // HANDLE TOAST
            toast.dismiss(loader);
            toast.success('Transfer successfully created!');
        } catch (err) {
            console.log('addTransferError:', err);
            toast.error(err.message);
            toast.dismiss(loader);
        }
    },
    updateTransfer: async (documentId, updatedTransfer, newFile) => {
        const editLoader = toast.loading('Updating Transfer');
        try {
            const docRef = doc(db, 'transfers', documentId);
            const currentTransferResponse = await getDoc(docRef);
            const currentTransfer = currentTransferResponse.data();

            // UPDATE THE FILES
            // UPLOAD IMAGE
            const fileRef = ref(storage, currentTransfer.photoRef);
            let fileUrl, fileRefName;
            if (currentTransfer.photoUrl !== newFile?.source) {
                if (currentTransfer.photoUrl !== '') {
                    // DELETE THE OBJECT
                    await deleteObject(fileRef);
                }

                if (newFile) {
                    {
                        fileRefName = `transfers/${uuidv4()}-${newFile.file.name}`;
                        const imageRef = ref(storage, fileRefName);

                        const fileUpload = await uploadBytes(imageRef, newFile.file);
                        fileUrl = await getDownloadURL(fileUpload.ref);
                        console.log('UPLOADED');
                    }
                }
            }

            // GET ACCOUNT DATA
            const prevReceiverAccountRef = doc(db, "accounts", currentTransfer.targetReceiverAccount.id);
            const prevSenderAccountRef = doc(db, "accounts", currentTransfer.targetSenderAccount.id);
            const prevReceiverAccountResponse = await getDoc(prevReceiverAccountRef);
            const prevSenderAccountResponse = await getDoc(prevSenderAccountRef);

            const prevReceiverAccount = prevReceiverAccountResponse.data();
            const prevSenderAccount = prevSenderAccountResponse.data();

            // RETURN THE PREVIOUS TRANSFER
            await updateDoc(prevSenderAccountRef, {
                account_amount: prevSenderAccount.account_amount + currentTransfer.amount
            });
            await updateDoc(prevReceiverAccountRef, {
                account_amount: prevReceiverAccount.account_amount - currentTransfer.amount
            });

            // ADD CURRENT TRANSFER
            const receiverAccountRef = doc(db, "accounts", updatedTransfer.targetReceiverAccount.id);
            const senderAccountRef = doc(db, "accounts", updatedTransfer.targetSenderAccount.id);
            const receiverAccountResponse = await getDoc(receiverAccountRef);
            const senderAccountResponse = await getDoc(senderAccountRef);

            const receiverAccount = receiverAccountResponse.data();
            const senderAccount = senderAccountResponse.data();

            await updateDoc(senderAccountRef, {
                account_amount: senderAccount.account_amount - updatedTransfer.amount
            });
            await updateDoc(receiverAccountRef, {
                account_amount: receiverAccount.account_amount + updatedTransfer.amount
            });
            
            // CREATE A REFERENCE TO THE DOCUMENT AND THE FILE
            await updateDoc(docRef, {
                ...updatedTransfer,
                photoRef: fileRefName || currentTransfer.photoRef,
                photoUrl: fileUrl || currentTransfer.photoUrl
            });

            toast.success('Updated Successfully.');

            return true;
        } catch (err) {
            console.log('updateTransferError:', err);
            toast.error(err.message);

            return false;
        } finally {
            toast.dismiss(editLoader);
        }
    },
    deleteTransfer: async (documentId, fileReference) => {
        console.log('Delete', documentId);
        const deleteLoader = toast.loading('Deleting Transfer');
        // CREATE A REFERENCE FOR THE DOCUMENT AND THE FILE
        const docRef = doc(db, 'transfers', documentId);
        const fileRef = ref(storage, fileReference);
        try {
            // GET TRANSFER DATA
            const targetTransfer = await getDoc(docRef);
            const currentTransfer = targetTransfer.data();
            console.log(currentTransfer)

            // GET ACCOUNT DATA
            const receiverAccountRef = doc(db, "accounts", currentTransfer.targetReceiverAccount.id);
            const senderAccountRef = doc(db, "accounts", currentTransfer.targetSenderAccount.id);
            const receiverAccountResponse = await getDoc(receiverAccountRef);
            const senderAccountResponse = await getDoc(senderAccountRef);

            const receiverAccount = receiverAccountResponse.data();
            const senderAccount = senderAccountResponse.data();
            
            if (senderAccount && receiverAccount) {
                // UPDATE ACCOUNTS
                await updateDoc(senderAccountRef, {
                    account_amount: senderAccount.account_amount + currentTransfer.amount
                });
                await updateDoc(receiverAccountRef, {
                    account_amount: receiverAccount.account_amount - currentTransfer.amount
                });
            }


            // DELETE THE DOCUMENT AND OBJECT
            await deleteDoc(docRef);
            if (fileReference) {
                await deleteObject(fileRef);
            }
            // ALERT A MESSAGE

            toast.success('Deleted Successfully!');

            return true;
        } catch (err) {
            console.log('deleteTransferError:', err);
            toast.error(err.message);
        } finally {
            toast.dismiss(deleteLoader);
        }
    },
    setTransactions: (transferList) => {
        set({
            transfers: transferList
        });
    },
})

export const useTransferStore = create(transferStore);