"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

export default function EmailManagementPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSendWeeklyReport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/send-weekly-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send weekly report.' });
      }
    } catch (error: unknown) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to send test email.' });
      }
    } catch (error: unknown) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-lg rounded-2xl p-8 mb-8"
        >
          <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
            <Mail className="mr-3 text-blue-600" /> Email Management
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Manual Email Sending */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Send Email Reports</h2>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., your-email@example.com"
                  className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-500 border-gray-300"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSendWeeklyReport}
                  disabled={loading || !email}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  Send Weekly Report
                </button>

                <button
                  onClick={handleSendTestEmail}
                  disabled={loading || !email}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    <Clock className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-5 w-5" />
                  )}
                  Send Test Email
                </button>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg flex items-center ${
                    message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  {message.text}
                </motion.div>
              )}
            </div>

            {/* Automation Info */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Automation Status</h2>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Weekly Schedule</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Automated reports are sent every Monday at 9:00 AM
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Email Service</span>
                </div>
                <p className="text-green-700 text-sm">
                  Gmail integration is active and ready
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-800">Default Recipient</span>
                </div>
                <p className="text-gray-700 text-sm">
                  fangasisye@gmail.com
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
