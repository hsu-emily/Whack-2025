import React from 'react';
import Layout from '../components/Layout';
import NavBar from '../components/NavBar';

const About = () => {
    return (
        <Layout>
           <NavBar></NavBar>
            <div className="page-content">
                <h1 className="page-heading">
                    Welcome to Punchie Pass
                </h1>
                <p className="page-text">
                    This is the About Page
                </p>
            </div>
        </Layout>
    );
};

export default About;