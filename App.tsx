
import React, { useState, useCallback, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, increment, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { FAQ, Category, Page } from './types';
import Header from './components/Header';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('user');

  useEffect(() => {
    const q = query(collection(db, "faqs"), orderBy("updatedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const faqsData = querySnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            const formatTimestamp = (timestamp: Timestamp) => {
                return timestamp ? timestamp.toDate().toISOString().split('T')[0] : '';
            }
            return {
                id: docSnapshot.id,
                question: data.question,
                answer: data.answer,
                category: data.category,
                views: data.views,
                helpful: data.helpful,
                notHelpful: data.notHelpful,
                createdAt: formatTimestamp(data.createdAt),
                updatedAt: formatTimestamp(data.updatedAt),
            } as FAQ;
        });
        setFaqs(faqsData);
    }, (error) => {
        console.error("Error fetching FAQs: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addFaq = useCallback(async (faq: Omit<FAQ, 'id' | 'views' | 'helpful' | 'notHelpful' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'faqs'), {
        ...faq,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }, []);

  const updateFaq = useCallback(async (updatedFaq: FAQ) => {
    const faqRef = doc(db, 'faqs', updatedFaq.id);
    try {
      await updateDoc(faqRef, {
        question: updatedFaq.question,
        answer: updatedFaq.answer,
        category: updatedFaq.category,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  }, []);

  const deleteFaq = useCallback(async (id: string) => {
    try {
        await deleteDoc(doc(db, 'faqs', id));
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
  }, []);
  
  const incrementViewCount = useCallback(async (id: string) => {
    const faqRef = doc(db, 'faqs', id);
    try {
        await updateDoc(faqRef, {
            views: increment(1)
        });
    } catch (error) {
        console.error("Error updating view count: ", error);
    }
  }, []);

  const handleFeedback = useCallback(async (id: string, type: 'helpful' | 'notHelpful') => {
    const faqRef = doc(db, 'faqs', id);
    try {
        await updateDoc(faqRef, {
            [type]: increment(1)
        });
    } catch (error) {
        console.error("Error handling feedback: ", error);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="p-4 sm:p-6 md:p-8">
        {currentPage === 'user' ? (
          <UserPage faqs={faqs} onIncrementView={incrementViewCount} onFeedback={handleFeedback} />
        ) : (
          <AdminPage faqs={faqs} onAdd={addFaq} onUpdate={updateFaq} onDelete={deleteFaq} />
        )}
      </main>
    </div>
  );
};

export default App;
