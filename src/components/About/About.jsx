import React from 'react';
import './About.css';

function About() {
  return (
    <section className="about">
      <div className="about__container">
        <div className="about__image-wrapper">
          <div className="about__image-placeholder"></div>
        </div>
        <div className="about__content">
          <h2 className="about__title">About the author</h2>
          <p className="about__text">
            Hello! My name is Darwin, and I'm a tech enthusiast with a passion for both software and
            hardware. I currently work as a freelancer, specializing in web development with HTML,
            CSS, JavaScript, React, and Node.js.
          </p>
          <p className="about__text">
            At TripleTen the education emphasis on contemporary tech stacks and proven software
            development practices as core components of its curriculum. These methodologies are not
            only relevant within the classroom but are also highly transferable to the wider
            technology industry.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
