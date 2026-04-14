// src/pages/listings/PostProject.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadProject } from "../../services/listingsAPI";
import { X } from "lucide-react";

const initialForm = {
  title: "",
  category: "",
  tags: [],
  tech_stack: [],
  description: "",
  price: "",
  demo_link: "",
  delivery_method: "GitHub",
  license: "Educational Use Only",
  cover_image: null, // File
  gallery: [],       // Files
  video_demo: "",
  documents: {
    ppt: null,
    abstract: null,
    blackbook: null,
    literatureSurvey: null,
  },
};

const steps = [
  { key: "basics", label: "Basics" },
  { key: "pricing", label: "Pricing & Delivery" },
  { key: "documents", label: "Documents" },
  { key: "media", label: "Media & Review" },
];

// -------------------
// Tag Input Component
// -------------------
function TagInput({ label, values, setValues, placeholder }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = input.trim();
      if (newTag && !values.includes(newTag)) {
        setValues([...values, newTag]);
      }
      setInput("");
    }
  };

  const removeTag = (tag) => setValues(values.filter((t) => t !== tag));

  return (
    <div>
      <label className="block text-sm text-gray-300 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
        {values.map((tag, i) => (
          <span
            key={i}
            className="bg-emerald-600/20 text-emerald-300 px-2 py-1 rounded-lg flex items-center gap-1 text-sm"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none py-1 text-sm"
        />
      </div>
    </div>
  );
}

export default function PostProject() {
  const [form, setForm] = useState(initialForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [aiLoading, setAiLoading] = useState({
    ppt: false,
    abstract: false,
    blackbook: false,
    literatureSurvey: false,
  });

  const navigate = useNavigate();

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / steps.length) * 100),
    [stepIndex]
  );

  // ------------------
  // HANDLERS
  // ------------------
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm((f) => ({ ...f, cover_image: file }));
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((f) => ({ ...f, gallery: [...f.gallery, ...files] }));
  };

  const handleDocumentUpload = (key, file) => {
    if (file) {
      setForm((f) => ({
        ...f,
        documents: { ...f.documents, [key]: file },
      }));
    }
  };

  const handleNext = () => {
    const err = validateStep();
    if (!err) setStepIndex((i) => i + 1);
  };
  const handleBack = () => setStepIndex((i) => i - 1);

  // ------------------------
  // AI GENERATION (unchanged)
  // ------------------------
  const handleGenerateAI = async (docType) => {
    if (!form.title.trim()) {
      alert("Please enter project title first!");
      return;
    }
    try {
      setAiLoading((prev) => ({ ...prev, [docType]: true }));

      const res = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          title: form.title,
          description: form.description,
          techStack: form.tech_stack,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      setForm((f) => ({
        ...f,
        documents: { ...f.documents, [docType]: data.documentURL },
      }));

      alert(`✅ AI generated ${docType}!`);
    } catch (err) {
      console.error("AI error:", err);
      alert("❌ Failed to generate AI doc.");
    } finally {
      setAiLoading((prev) => ({ ...prev, [docType]: false }));
    }
  };

  const handleConvertDownload = async (docType, format) => {
    const fileUrl = form.documents[docType];
    if (!fileUrl) return alert("No file available for conversion!");
    try {
      const res = await fetch("http://localhost:5000/api/ai/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, format, docType }),
      });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const a = document.createElement("a");
      const extension = format.toLowerCase() === "ppt" ? "pptx" : "pdf";
      a.href = window.URL.createObjectURL(blob);
      a.download = `${form.title}_${docType}.${extension}`;
      a.click();
      a.remove();
    } catch (err) {
      console.error("Convert error:", err);
      alert("❌ Failed to convert/download.");
    }
  };

  // ------------------------
  // SUBMIT
  // ------------------------
  const validateStep = () => {
    let error = {};
    if (steps[stepIndex].key === "basics") {
      if (!form.title.trim()) error.title = "Project title is required.";
      if (!form.category) error.category = "Project category is required.";
      if (!form.description.trim())
        error.description = "Project description is required.";
      if (!form.tech_stack.length)
        error.tech_stack = "Add at least one technology.";
    }
    if (steps[stepIndex].key === "pricing") {
      if (!form.price || Number(form.price) <= 0)
        error.price = "Enter a valid price.";
      if (!form.delivery_method)
        error.delivery_method = "Select a delivery method.";
    }
    if (steps[stepIndex].key === "documents") {
      if (!form.documents.ppt)
        error.ppt = "Project Presentation (PPT) is required.";
      if (!form.documents.abstract)
        error.abstract = "Abstract is required.";
      if (!form.documents.blackbook)
        error.blackbook = "Black Book is required.";
      if (!form.documents.literatureSurvey)
        error.literatureSurvey = "Literature Survey is required.";
    }
    if (steps[stepIndex].key === "media") {
      if (!form.cover_image) error.cover_image = "Cover image is required.";
    }
    setErrors(error);
    return Object.keys(error).length ? error : null;
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("demo_link", form.demo_link);
      formData.append("delivery_method", form.delivery_method);
      formData.append("license", form.license);
      form.tech_stack.forEach((t) => formData.append("tech_stack[]", t));
      form.tags.forEach((tag) => formData.append("tags[]", tag));
      if (form.cover_image) formData.append("cover_image", form.cover_image);
      form.gallery.forEach((file) => formData.append("gallery[]", file));
      if (form.documents.ppt) formData.append("project_ppt", form.documents.ppt);
      if (form.documents.abstract) formData.append("abstract_doc", form.documents.abstract);
      if (form.documents.blackbook) formData.append("blackbook", form.documents.blackbook);
      if (form.documents.literatureSurvey) formData.append("literature_survey", form.documents.literatureSurvey);

      await uploadProject(formData);
      navigate("/listings/my-projects");
    } catch (err) {
      console.error(err);
      setErrors({
        submit: err?.response?.data?.error || "Failed to submit project.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------
  // RENDER
  // ------------------
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Post Your Project
          </h1>
          <p className="mt-2 text-teal-200/90">
            Showcase your work and reach a wide audience. Fill out the form
            below to submit your project.
          </p>
        </div>

        {/* Stepper */}
        <div>
          <div className="flex justify-between items-center text-sm mb-2">
            {steps.map((s, idx) => (
              <div key={s.key} className="flex-1 flex items-center">
                <div
                  className={`px-3 py-1 rounded-full border ${idx === stepIndex
                      ? "border-emerald-400 text-emerald-300"
                      : idx < stepIndex
                        ? "border-emerald-700 text-emerald-600"
                        : "border-gray-700 text-gray-500"
                    }`}
                >
                  {s.label}
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-px mx-2 bg-gray-800" />
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-800 h-2 rounded">
            <div
              className="h-2 bg-emerald-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 shadow-xl space-y-6">
          {/* BASICS STEP */}
          {steps[stepIndex].key === "basics" && (
            <div className="grid gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Project Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Enter project title here"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Project Category <span className="text-emerald-400">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none"
                >
                  <option value="">Select category</option>
                  <option>Web App</option>
                  <option>Mobile App</option>
                  <option>Game</option>
                  <option>AI/ML Model</option>
                  <option>Other</option>
                </select>
                {errors.category && (
                  <p className="text-red-400 text-sm">{errors.category}</p>
                )}
              </div>

              {/* Tags */}
              <TagInput
                label="Tags (keywords to describe your project)"
                values={form.tags}
                setValues={(vals) => setForm((f) => ({ ...f, tags: vals }))}
                placeholder="Type a keyword and press Enter"
              />

              {/* Tech Stack */}
              <TagInput
                label="Tech Stack *"
                values={form.tech_stack}
                setValues={(vals) => setForm((f) => ({ ...f, tech_stack: vals }))}
                placeholder="Type a technology and press Enter"
              />
              {errors.tech_stack && (
                <p className="text-red-400 text-sm">{errors.tech_stack}</p>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Project Description <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Describe your project with features, use cases, etc."
                  className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none"
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">{errors.description}</p>
                )}
              </div>
            </div>
          )}

          {/* PRICING STEP */}
          {steps[stepIndex].key === "pricing" && (
            <div className="grid gap-6">
              {/* Price */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Price (₹) <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  min="0"
                  step="0.01"
                  placeholder="1999"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm">{errors.price}</p>
                )}
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Delivery Method (how you’ll share the project) <span className="text-emerald-400">*</span>
                </label>
                <select
                  name="delivery_method"
                  value={form.delivery_method}
                  onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none"
                >
                  <option value="GitHub">GitHub Repo Invite</option>
                  <option value="GoogleDrive">Google Drive</option>
                  <option value="Dropbox">Dropbox</option>
                  <option value="Other">Other</option>
                </select>
                {errors.delivery_method && (
                  <p className="text-red-400 text-sm">{errors.delivery_method}</p>
                )}
              </div>

              {/* License */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  License (optional)
                </label>
                <select
                  name="license"
                  value={form.license}
                  onChange={onChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none"
                >
                  <option>Educational Use Only</option>
                  <option>Personal Portfolio / Reference</option>
                  <option>MIT</option>
                  <option>Unlicensed</option>
                  <option>Custom License</option>
                </select>
              </div>

              {/* Demo Link */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Demo Link (optional)
                </label>
                <input
                  type="text"
                  name="demo_link"
                  value={form.demo_link}
                  onChange={onChange}
                  placeholder="https://your-demo.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* DOCUMENTS STEP */}
          {steps[stepIndex].key === "documents" && (
            <div className="grid gap-6">
              <p className="text-gray-300 text-sm">
                Upload or generate all required documentation.
              </p>

              {["ppt", "abstract", "blackbook", "literatureSurvey"].map((doc) => (
                <div key={doc} className="space-y-2">
                  <label className="block text-sm text-gray-300 mb-1 capitalize">
                    {doc === "ppt"
                      ? "Project Presentation (PPT) *"
                      : doc === "abstract"
                        ? "Abstract *"
                        : doc === "blackbook"
                          ? "Black Book *"
                          : "Literature Survey *"}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="file"
                      onChange={(e) =>
                        handleDocumentUpload(doc, e.target.files[0])
                      }
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleGenerateAI(doc)}
                      disabled={aiLoading[doc]}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      {aiLoading[doc] && (
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                      )}
                      {aiLoading[doc] ? "Generating..." : "Generate with AI ✨"}
                    </button>
                  </div>
                  {errors[doc] && (
                    <p className="text-red-400 text-sm">{errors[doc]}</p>
                  )}

                  {form.documents[doc] && (
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <a
                        href={form.documents[doc]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 text-xs underline"
                      >
                        View {doc}
                      </a>
                      <a
                        href={form.documents[doc]}
                        download={`${form.title}_${doc}`}
                        className="text-teal-300 text-xs underline"
                      >
                        Download {doc}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleConvertDownload(doc, "pdf")}
                        className="text-xs text-gray-200 underline"
                      >
                        Download as PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConvertDownload(doc, "ppt")}
                        className="text-xs text-gray-200 underline"
                      >
                        Download as PPT
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* MEDIA & REVIEW STEP */}
          {steps[stepIndex].key === "media" && (
            <div className="grid gap-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Cover Image <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
                />
                {errors.cover_image && (
                  <p className="text-red-400 text-sm">{errors.cover_image}</p>
                )}
              </div>

              {/* Gallery */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Gallery (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {form.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt="gallery"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                    />
                  ))}
                </div>
              </div>

              {/* Video Demo */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Video Demo (optional)
                </label>
                <input
                  type="text"
                  name="video_demo"
                  value={form.video_demo}
                  onChange={onChange}
                  placeholder="YouTube or Vimeo link"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Review */}
              <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-emerald-300">
                  Review Your Project
                </h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>
                    <strong>Title:</strong> {form.title || "Not set"}
                  </li>
                  <li>
                    <strong>Category:</strong> {form.category || "Not set"}
                  </li>
                  <li>
                    <strong>Price:</strong> {form.price ? `₹${form.price}` : "Not set"}
                  </li>
                  <li>
                    <strong>Tech Stack:</strong>{" "}
                    {form.tech_stack.length ? form.tech_stack.join(", ") : "Not set"}
                  </li>
                  <li>
                    <strong>Delivery:</strong> {form.delivery_method}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {stepIndex < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-sm font-medium"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Project"}
            </button>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-400 text-center mt-4">{errors.submit}</p>
        )}
      </div>
    </div>
  );
}
