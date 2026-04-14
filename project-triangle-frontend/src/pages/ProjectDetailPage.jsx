import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Download, Film, Link as LinkIcon, Images, Tag, Briefcase, FileText, BookOpen, Microscope } from 'lucide-react';

const parseJsonField = (jsonString) => {
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : (typeof parsed === 'string' && parsed.length > 0 ? [parsed] : []);
  } catch (e) {
    if (typeof jsonString === 'string' && jsonString.length > 0) {
      return jsonString.split(',').map(item => item.trim());
    }
    return [];
  }
};

const ProjectDetailPage = () => {
  const { projectId } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        // Use axios and the correct relative path
        const response = await axios.get(`/api/listings/project/${projectId}`);
        setProject(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Project not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-950 text-white">Loading Project...</div>;
  }

  if (error || !project) {
    return <div className="flex justify-center items-center h-screen bg-gray-950 text-red-500">Error: {error || 'Project could not be found.'}</div>;
  }

  const techStack = parseJsonField(project.tech_stack);
  const tags = parseJsonField(project.tags);
  const galleryImages = parseJsonField(project.gallery);
  const description = project.description || project.long_desc;

  const documents = [
    { label: "Project Presentation", path: project.project_ppt, icon: <Briefcase size={18} /> },
    { label: "Abstract", path: project.abstract_doc, icon: <FileText size={18} /> },
    { label: "Black Book", path: project.blackbook, icon: <BookOpen size={18} /> },
    { label: "Literature Survey", path: project.literature_survey, icon: <Microscope size={18} /> },
  ].filter(doc => doc.path);

  return (
    <div className="bg-gray-950 text-gray-200 min-h-screen p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-emerald-400 mb-2 font-semibold">{project.category}</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">{project.title}</h1>
          <p className="text-gray-400 mt-2">Sold by: <span className="font-semibold text-gray-300">{project.seller_name || 'Unknown'}</span></p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">
            
            <img 
              src={project.cover_image ? `/uploads/${project.cover_image.replace(/\\/g, "/")}` : "https://placehold.co/1280x720/0d1117/2dd4bf?text=Project+Image"}
              alt={project.title}
              className="w-full h-auto object-cover rounded-lg shadow-2xl border-2 border-gray-800"
            />

            <div>
              <h2 className="text-3xl font-semibold text-white border-b-2 border-emerald-500/30 pb-3 mb-4">Project Details</h2>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{description}</p>
            </div>

            {galleryImages.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2 mb-4 flex items-center gap-2"><Images size={20} /> Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((imgPath, index) => (
                    <img key={index} src={`/uploads/${imgPath.replace(/\\/g, "/")}`} alt={`Gallery image ${index + 1}`} className="w-full h-auto object-cover rounded-lg border border-gray-800"/>
                  ))}
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-white border-b border-gray-700 pb-2 mb-4 flex items-center gap-2"><Download size={20} /> Included Documents</h2>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <a key={index} href={`/uploads/${doc.path.replace(/\\/g, "/")}`} download className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400">{doc.icon}</span>
                        <span className="font-medium text-gray-300">{doc.label}</span>
                      </div>
                      <Download className="text-gray-500" size={18}/>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 bg-gray-900 border border-gray-800 p-6 rounded-2xl h-fit sticky top-8 space-y-6">
            <div className="text-4xl font-bold text-white text-center">₹{Number(project.price).toLocaleString()}</div>
            
            {/* ✨ THIS IS THE CORRECTED "BUY NOW" BUTTON ✨ */}
            <Link 
              to={`/buy/${project.id}`} 
              state={{ project: project }}
              className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-transform duration-200 hover:scale-105"
            >
              Buy Now
            </Link>

            <div className="space-y-6 pt-6 border-t border-gray-700">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <span key={index} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm font-medium">{tech}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2"><Tag size={16}/> Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="bg-emerald-800/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">More Info</h4>
                <div className="text-sm space-y-2 text-gray-400">
                  <p><strong>Delivery Method:</strong> <span className="text-gray-300">{project.delivery_method}</span></p>
                  <p><strong>License:</strong> <span className="text-gray-300">{project.license}</span></p>
                </div>
              </div>
              {(project.demo_link || project.video_demo) && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Links</h4>
                  <div className="space-y-2">
                    {project.demo_link && <a href={project.demo_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-400 hover:underline"><LinkIcon size={14}/> View Live Demo</a>}
                    {project.video_demo && <a href={project.video_demo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-emerald-400 hover:underline"><Film size={14}/> Watch Video Demo</a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;