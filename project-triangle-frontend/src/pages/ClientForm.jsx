import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClientForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    file: null,
    skills: "",
  });

  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => {
    if (step === 1 && (!formData.title || !formData.category)) {
      setErrorMsg("❌ Please fill all fields in this step.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }
    if (step === 2 && (!formData.description || !formData.skills)) {
      setErrorMsg("❌ Please fill all fields in this step.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }
    if (step === 3 && (!formData.budget || !formData.deadline)) {
      setErrorMsg("❌ Please fill all fields in this step.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }
    setErrorMsg("");
    setStep((prev) => prev + 1);
  };

  // ✨ Updated: Enter key only triggers Next for steps 1-3
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (step < 4) {
        e.preventDefault(); // Prevent form submission
        handleNext();       // Advance to next step
      }
      // Step 4 allows default Enter behavior (submit)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.skills ||
      !formData.budget ||
      !formData.deadline
    ) {
      setErrorMsg("❌ Please ensure all required fields are filled.");
      setTimeout(() => setErrorMsg(""), 4000);
      return;
    }

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formPayload.append(key, value);
    });

    try {
      await axios.post("/api/projects/submit-project", formPayload);

      setErrorMsg("");
      setShowModal(true);
      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        deadline: "",
        file: null,
        skills: "",
      });
      setStep(1);
    } catch (err) {
      console.error("Submit error:", err);
      const message =
        err.response?.data?.error || "Error submitting form. Please try again.";
      setErrorMsg(`❌ ${message}`);
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  const stepTitles = ["Basics", "Details", "Pricing & Delivery", "Media & Review"];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col font-sans">
      {/* Header */}
      <div className="text-center mt-10">
        <h2 className="text-4xl font-bold">Post Your Project</h2>
        <p className="text-slate-400 mt-2">
          Showcase your work and reach a wide audience. Fill out the form below to submit your project.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex justify-center mt-8">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between text-sm font-medium text-slate-400">
            {stepTitles.map((title, i) => (
              <span key={i} className={step === i + 1 ? "text-teal-400" : ""}>
                {title}
              </span>
            ))}
          </div>
          <div className="w-full h-1 bg-slate-700 mt-2 rounded">
            <div
              className="h-1 bg-teal-500 rounded transition-all"
              style={{ width: `${(step / stepTitles.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 justify-center p-6 md:p-10">
        <div className="bg-[#161b22] w-full max-w-3xl p-8 rounded-xl shadow-lg">
          {errorMsg && (
            <p className="text-red-500 font-semibold mb-4 text-center">{errorMsg}</p>
          )}

          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
            {/* Step 1 */}
            {step === 1 && (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter project title here"
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-[#0d1117] border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-[#0d1117] border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white"
                  >
                    <option value="">Select category</option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">UI/UX Design</option>
                    <option value="data">Data Science</option>
                  </select>
                </div>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter a brief description of your project"
                    required
                    rows="4"
                    className="w-full px-4 py-3 text-sm rounded-lg bg-[#0d1117] border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">
                    Required Skills <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g., React, Node.js"
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-[#0d1117] border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white"
                  />
                </div>
              </>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="$500 - $1000"
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-[#0d1117] border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-lg bg-[#0d1117] border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white"
                  />
                </div>
              </>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <>
                <div>
                  <label className="block font-semibold mb-2 text-slate-300">
                    Upload File (Optional)
                  </label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm rounded-lg bg-[#0d1117] border border-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none text-white"
                  />
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-teal-400">Review Your Details</h4>
                  <p><strong>Title:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {formData.category}</p>
                  <p><strong>Description:</strong> {formData.description}</p>
                  <p><strong>Skills:</strong> {formData.skills}</p>
                  <p><strong>Budget:</strong> {formData.budget}</p>
                  <p><strong>Deadline:</strong> {formData.deadline}</p>
                  <p><strong>File:</strong> {formData.file ? formData.file.name : "No file uploaded"}</p>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((prev) => prev - 1)}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-2 rounded-lg"
                >
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded-lg ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition ml-auto"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-[#161b22] p-8 rounded-xl shadow-lg text-center max-w-sm">
            <h3 className="text-xl font-semibold text-teal-400 mb-4">✅ Project Submitted!</h3>
            <p className="text-slate-300 mb-6">Your project has been successfully uploaded.</p>
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/freelance");
              }}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientForm;
