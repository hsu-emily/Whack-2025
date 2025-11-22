import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import FramerCarousel from '../components/FramerCarousel';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [punchCards, setPunchCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchCards = async () => {
      setLoading(true);
      const q = query(collection(db, 'punchPasses'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const cards = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPunchCards(cards);
      setLoading(false);
    };
    fetchCards();
  }, [user]);

  return (
    <Layout>
      <h1>Welcome to the dashboard</h1>
      <p>
        This is the dashboard page. Use the navigation to explore the app features.
      </p>
      <button
        onClick={() => navigate('/create-punch-pass')}
        className="mt-6 px-6 py-3 bg-pink-500 text-white rounded-full shadow hover:bg-pink-600 font-bold text-lg"
      >
        + Create a Punch Card
      </button>
      <div className="mt-10">
        {!loading && <FramerCarousel punchCards={punchCards} />}
      </div>
    </Layout>
  );
};

export default Dashboard;
