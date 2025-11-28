import { Edit2, GraduationCap, Target, Info } from 'lucide-react';
import { Button } from './ui/button';
import { currentUser } from '../utils/mockData';

export function ProfilePage() {
  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl">
            {currentUser.name.charAt(0)}
          </div>
          <Button
            variant="outline"
            className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:bg-opacity-30"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
        <h2 className="text-white mb-1">{currentUser.name}</h2>
        <p className="text-purple-100">{currentUser.campus}</p>
        <p className="text-purple-100 text-sm mt-2">{currentUser.bio}</p>
      </div>

      {/* I Can Teach */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900">I Can Teach</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentUser.teachSkills.map((skill, index) => (
            <div
              key={index}
              className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
            >
              <span>{skill.skill}</span>
              <span className="text-xs bg-purple-200 px-2 py-0.5 rounded-full">
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* I Want to Learn */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-pink-600" />
          <h3 className="text-gray-900">I Want to Learn</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentUser.learnSkills.map((skill, index) => (
            <div
              key={index}
              className="bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
            >
              <span>{skill.skill}</span>
              <span className="text-xs bg-pink-200 px-2 py-0.5 rounded-full">
                {skill.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* About SkillSwap */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-gray-600" />
          <h3 className="text-gray-900">About SkillSwap</h3>
        </div>
        <p className="text-gray-700 text-sm mb-3">
          SkillSwap enables anyone to learn by teaching. We match learners to real humans who already have the skill. No fees, no hierarchies — just swaps, stories, and shared growth.
        </p>
        <p className="text-purple-600 text-sm">
          <span className="italic">Teach one. Learn many.</span>
        </p>
        <p className="text-gray-600 text-xs mt-3">
          Values: authentic, practical, human-first, equal exchange
        </p>
      </div>
    </div>
  );
}
