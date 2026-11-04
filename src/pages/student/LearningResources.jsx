import { useState } from 'react';
import { FileText, Video, Link as LinkIcon, Presentation, Download, Search, FolderOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

const RESOURCE_ICONS = {
  pdf: { icon: FileText, color: 'bg-red-100 text-red-600', label: 'PDF' },
  ppt: { icon: Presentation, color: 'bg-orange-100 text-orange-600', label: 'PPT' },
  video: { icon: Video, color: 'bg-rose-100 text-rose-600', label: 'Video' },
  link: { icon: LinkIcon, color: 'bg-sky-100 text-sky-600', label: 'Link' },
};

export default function LearningResources() {
  const { user } = useAuth();
  const { db } = useData();
  
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter resources for student's department
  const mySubjects = db.subjects.filter(s => s.department === user.department);
  const mySubjectIds = mySubjects.map(s => s.id);
  
  const allResources = db.resources.filter(r => mySubjectIds.includes(r.subjectId));

  const filteredResources = allResources.filter(r => {
    const matchesSubject = selectedSubject === 'All' || r.subjectId === selectedSubject;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const handleView = (resource) => {
    // In a real app with Firebase, this would be resource.url
    // For demo, we just open a placeholder alert
    if (resource.type === 'link' || resource.type === 'video') {
      window.open(resource.url, '_blank');
    } else {
      alert(`Demo: Opening ${resource.title}\n(File URL: ${resource.url})`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Learning Resources</h1>
        <p className="page-subtitle">Access notes, presentations, and videos for your subjects</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex gap-2 overflow-x-auto w-full pb-2 sm:pb-0 hide-scrollbar">
          <button 
            onClick={() => setSelectedSubject('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${selectedSubject === 'All' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            All Subjects
          </button>
          {mySubjects.map(sub => (
            <button 
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${selectedSubject === sub.id ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              {sub.name}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="input-field pl-9 bg-slate-50 border-transparent focus:bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length > 0 ? filteredResources.map(resource => {
          const subject = db.subjects.find(s => s.id === resource.subjectId);
          const config = RESOURCE_ICONS[resource.type] || RESOURCE_ICONS.pdf;
          const Icon = config.icon;

          return (
            <div key={resource.id} className="card hover:-translate-y-1 transition-transform duration-300 flex flex-col group">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl shrink-0 ${config.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1 block">
                    {config.label} • {resource.size || 'External Link'}
                  </span>
                  <h3 className="font-semibold text-navy-900 leading-tight line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {resource.title}
                  </h3>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-navy-800">{subject?.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Added {formatDate(resource.createdAt)}</p>
                </div>
                <button 
                  onClick={() => handleView(resource)}
                  className="p-2 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-600 hover:text-white transition-colors"
                  title={resource.type === 'video' ? 'Watch Video' : 'Open Resource'}
                >
                  {resource.type === 'pdf' ? <Download size={18} /> : <LinkIcon size={18} />}
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full card">
            <EmptyState 
              icon={FolderOpen} 
              title="No resources found" 
              description="Try changing the subject filter or search query."
            />
          </div>
        )}
      </div>
    </div>
  );
}