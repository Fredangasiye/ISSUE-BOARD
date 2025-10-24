'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function EmailTestPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{success: boolean; message?: string; error?: string; report?: any} | null>(null);

  const sendTestReport = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/send-email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error: unknown) {
      setResult({
        success: false,
        error: 'Failed to send email report'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📧 Email Report Test
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 border-gray-300"
              />
            </div>

            <button
              onClick={sendTestReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending Report...
                </>
              ) : (
                <>
                  📤 Send Weekly Report
                </>
              )}
            </button>

            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl ${
                  result.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? '✅ Success!' : '❌ Error'}
                </h3>
                <p className={`text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error}
                </p>
                {result.report && (
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>Report Period:</strong> {result.report.weekStart} to {result.report.weekEnd}</p>
                    <p><strong>Total Issues:</strong> {result.report.totalIssues}</p>
                    <p><strong>New This Week:</strong> {result.report.newIssues}</p>
                    <p><strong>Resolved:</strong> {result.report.resolvedIssues}</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Setup Instructions:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Add your email credentials to environment variables</li>
              <li>2. Set EMAIL_USER and EMAIL_PASS in your .env.local file</li>
              <li>3. For Gmail, use an App Password (not your regular password)</li>
              <li>4. Test the email functionality above</li>
            </ol>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
