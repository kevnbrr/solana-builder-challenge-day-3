import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProjectCard } from './components/project-card';
import { DonorCard } from './components/donor-card';
import { WalletButton } from './components/wallet-button';
import { ProjectDetails } from './pages/project-details';
import { DonorProfile } from './pages/donor-profile';
import { mockProjects, mockDonors } from './data/mock';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-bold text-purple-600">
                SolanaCrowd
              </Link>
              <WalletButton />
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Top Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProjects.map((project) => (
                    <Link key={project.id} to={`/project/${project.id}`}>
                      <ProjectCard project={project} />
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-6">Top Donors</h2>
                <div className="space-y-4">
                  {mockDonors.map((donor) => (
                    <Link key={donor.id} to={`/donor/${donor.id}`}>
                      <DonorCard donor={donor} />
                    </Link>
                  ))}
                </div>
              </section>
            </main>
          } />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/donor/:id" element={<DonorProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;