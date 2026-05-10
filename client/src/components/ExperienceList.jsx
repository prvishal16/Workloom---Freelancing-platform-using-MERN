import React from 'react';
import { Briefcase, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ExperienceList = ({ experiences = [], isOwnProfile, onDelete }) => {
  if (experiences.length === 0) return <p className="text-gray-500">No experience added yet.</p>;

  return (
    <div className="space-y-4">
      {experiences.map(exp => (
        <div key={exp._id} className="flex gap-4 relative">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Briefcase className="text-gray-500" />
          </div>

          <div className="flex-grow">
            <div>
              <h4 className="font-bold text-gray-900">{exp.title}</h4>
              <p className="text-sm text-gray-700">{exp.company} {exp.location && `· ${exp.location}`}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(exp.startDate), 'MMM yyyy')} - {exp.endDate ? format(new Date(exp.endDate), 'MMM yyyy') : 'Present'}
              </p>
            </div>
            
            {exp.description && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
              </div>
            )}
          </div>

          {isOwnProfile && (
            <button 
              onClick={() => onDelete(exp._id)} 
              className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Delete experience"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExperienceList;