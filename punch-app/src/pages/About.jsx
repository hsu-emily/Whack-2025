import React from 'react';
import Layout from '../components/Layout';
import NavBar from '../components/NavBar';

const About = () => {
    return (
        <Layout>
            <NavBar/>
            <h1>Welcome to Punchie Pass</h1>
            <p>
                This is the About Page
            </p>
        </Layout>
    );
};

export default About;