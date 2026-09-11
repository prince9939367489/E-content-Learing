import React from 'react';

const About: React.FC = () => {
  const capabilities = [
    ['Course discovery', 'A responsive catalogue reads course data from the Express API and presents level, duration, rating, and price.'],
    ['Account access', 'Registration and login use validated email/password requests, bcrypt password hashes, and 24-hour JWT bearer tokens.'],
    ['Learning actions', 'Authenticated learners can enroll in a course and leave ratings or written feedback.'],
    ['Clear architecture', 'React and Vite power the interface while Express, Mongoose, and MongoDB handle API and persistence concerns.'],
  ];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-100">About the project</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">A full-stack prototype for exploring and joining online courses.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            E-Learn demonstrates how a typed React client, a REST API, MongoDB models, and token-based authentication work together in one learning platform.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="capabilities-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 id="capabilities-title" className="text-3xl font-bold text-gray-900">What it demonstrates</h2>
            <p className="mt-4 text-gray-600">
              The repository is designed as a portfolio-ready engineering prototype, with a separated frontend and backend and explicit API contracts.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {capabilities.map(([title, description]) => (
              <article key={title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto grid gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Current scope</h2>
            <p className="mt-4 text-gray-600">
              The working prototype includes accounts, course browsing, enrollment, profiles, and feedback. It does not yet include payments, video delivery, password reset, email verification, or an administration dashboard.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Security approach</h2>
            <p className="mt-4 text-gray-600">
              Passwords are hashed before storage, protected endpoints validate bearer tokens, and the API requires an explicit JWT secret. Tokens remain in browser local storage in this prototype; production hardening should move authentication to secure, HttpOnly cookies with refresh-token rotation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
