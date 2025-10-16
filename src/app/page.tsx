"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, AlertCircle, CheckCircle, Clock, Filter } from "lucide-react";
import { AIRTABLE_CONFIG } from "@/lib/config";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface Issue {
  id: string;
  fields: {
    Unit?: string;
    Category?: string;
    Description?: string;
    Status?: string;
    Photo?: string;
    Created?: string;
  };
}

interface FormData {
  unit: string;
  category: string;
  description: string;
  photo: string | null;
}

const categories = [
  "Maintenance",
  "Security", 
  "Cleaning",
  "Lighting",
  "Electricity",
  "Water",
  "Signage",
  "Other"
];

const statusColors = {
  "Pending": "bg-orange-100 text-orange-700 border-orange-200",
  "In progress": "bg-blue-100 text-blue-700 border-blue-200", 
  "Resolved": "bg-green-100 text-green-700 border-green-200"
};

const statusIcons = {
  "Pending": Clock,
  "In progress": AlertCircle,
  "Resolved": CheckCircle
};

export default function IssueBoard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [form, setForm] = useState<FormData>({
    unit: "",
    category: "",
    description: "",
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch issues from Airtable
  const fetchIssues = async () => {
    try {
      const response = await axios.get(
        `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.TABLE_NAME}?view=Grid%20view&sort%5B0%5D%5Bfield%5D=Created&sort%5B0%5D%5Bdirection%5D=desc`,
        {
          headers: { 
            Authorization: `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
          },
        }
      );
      setIssues(response.data.records);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setError("Failed to fetch issues. Please check your Airtable configuration.");
    }
  };

  // Handle photo upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePhotoUpload = (result: any) => {
    if (result.event === "success") {
      setForm({ ...form, photo: result.info.secure_url });
    }
  };

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    fetchIssues();
    const interval = setInterval(fetchIssues, 30000);
    return () => clearInterval(interval);
  }, []);

  // Apply filter
  useEffect(() => {
    if (filter === "All") {
      setFilteredIssues(issues);
    } else {
      const filtered = issues.filter(
        (record) => record.fields.Status === filter
      );
      setFilteredIssues(filtered);
    }
  }, [issues, filter]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const fields: {
        Unit: string;
        Category: string;
        Description: string;
        Status: string;
        Created: string;
        Photo?: string;
      } = {
        Unit: form.unit,
        Category: form.category,
        Description: form.description,
        Status: "Pending",
        Created: new Date().toISOString(),
      };

      if (form.photo) {
        fields.Photo = form.photo;
      }

      await axios.post(
        `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.TABLE_NAME}`,
        { fields },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Issue submitted successfully!");
      setForm({ unit: "", category: "", description: "", photo: null });
      fetchIssues();
    } catch (err) {
      console.error("Error submitting issue:", err);
      setError("Error submitting issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Community Issue Tracker
          </h1>
          <p className="text-lg text-gray-600">Huntingdon Terrace</p>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <button
            onClick={() => document.getElementById('report-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <AlertCircle className="mr-2 h-6 w-6" />
            Report an Issue
          </button>
          <button
            onClick={() => document.getElementById('current-issues')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <CheckCircle className="mr-2 h-6 w-6" />
            Current Issues
          </button>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl"
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Report Form */}
        <motion.div
          id="report-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white shadow-lg rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
            <AlertCircle className="mr-2 text-blue-600" />
            Report an Issue
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., 101, 2A, etc."
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Please describe the issue in detail..."
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo (Optional)
              </label>
              <CldUploadWidget
                uploadPreset="issue-board"
                onUpload={handlePhotoUpload}
                options={{
                  maxFiles: 1,
                  resourceType: "image",
                  maxFileSize: 5000000, // 5MB
                }}
              >
                {({ open }) => (
                  <div
                    onClick={() => open()}
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <div className="text-center">
                      <Camera className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {form.photo ? "Photo uploaded ✓" : "Click to upload a photo"}
                      </p>
                      {form.photo && (
          <Image
                          src={form.photo} 
                          alt="Uploaded" 
                          width={80}
                          height={80}
                          className="mt-2 h-20 w-20 object-cover rounded-lg mx-auto"
                        />
                      )}
                    </div>
                  </div>
                )}
              </CldUploadWidget>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Submit Issue
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Divider */}
        <div id="current-issues" className="flex items-center my-8">
          <div className="flex-1 border-t border-gray-300"></div>
          <div className="px-4 text-gray-500 font-medium">Current Issues</div>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <Filter className="h-5 w-5 text-gray-500 mt-1" />
          {["All", "Pending", "In progress", "Resolved"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === status
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {status}
            </button>
          ))}
        </motion.div>

        {/* Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Current Issues ({filteredIssues.length})
          </h2>
          
          <AnimatePresence>
            {filteredIssues.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No issues found.</p>
              </motion.div>
            ) : (
              filteredIssues.map((record, index) => {
                const { Unit, Category, Description, Status } = record.fields;
                const StatusIcon = statusIcons[Status as keyof typeof statusIcons] || Clock;
                const colorClass = statusColors[Status as keyof typeof statusColors] || statusColors.Pending;

                return (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-800 mb-1">
                          {Category || "Unnamed Issue"}
                        </h3>
                        {Unit && (
                          <p className="text-sm text-gray-600 mb-2">Unit: {Unit}</p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-medium rounded-lg border flex items-center ${colorClass}`}
                      >
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {Status || "Pending"}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">
                      {Description || "No description provided"}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Issue ID: {record.id.slice(-8)}
                      </p>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}