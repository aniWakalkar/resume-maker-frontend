import Navbar from '../../../components/layout/Navbar';
import Card from '../../../components/common/Card';

function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">About Hobu</h1>
            <p className="text-lg text-gray-600 mt-2">Your career journey starts here</p>
          </div>

          <Card>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To empower jobseekers with the tools and resources they need to find their dream jobs 
                  and build successful careers.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">What We Offer</h2>
                <ul className="space-y-2 text-gray-600">
                  <li>✓ AI-powered resume builder</li>
                  <li>✓ Professional templates</li>
                  <li>✓ Job search assistance</li>
                  <li>✓ Career guidance resources</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Contact Us</h2>
                <p className="text-gray-600">Email: support@hobu.com</p>
                <p className="text-gray-600">Follow us on social media for updates</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default About;