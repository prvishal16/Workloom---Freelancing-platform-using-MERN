import React from 'react';
import { BookOpen, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const EducationList = ({ educations = [], isOwnProfile, onDelete }) => {
  if (educations.length === 0) return <p className="text-gray-500">No education added yet.</p>;

  return (
    <div className="space-y-4">
      {educations.map(edu => (
        <div key={edu._id} className="flex gap-4 relative">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <BookOpen className="text-gray-500" />
          </div>
          <div className="flex-grow">
            <h4 className="font-bold">{edu.school}</h4>
            <p className="text-sm">{edu.degree}, {edu.fieldOfStudy}</p>
            <p className="text-xs text-gray-500">
              {format(new Date(edu.startDate), 'MMM yyyy')} - {edu.endDate ? format(new Date(edu.endDate), 'MMM yyyy') : 'Present'}
            </p>
          </div>
          {isOwnProfile && (
            <button onClick={() => onDelete(edu._id)} className="absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EducationList;