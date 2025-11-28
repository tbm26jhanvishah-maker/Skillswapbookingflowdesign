import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { searchSkills, addUserSkill } from '../utils/supabaseApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GraduationCap, Search, X, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { OnboardingProgress } from './OnboardingProgress';

interface Skill {
  id: string;
  name: string;
  category?: string;
}

export function AddTeachSkillsScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      loadSkills();
    } else {
      setSkills([]);
    }
  }, [searchQuery]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const data = await searchSkills(searchQuery);
      setSkills(data);
    } catch (error) {
      console.error('Error searching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: Skill) => {
    if (selectedSkills.find(s => s.id === skill.id)) {
      setSelectedSkills(selectedSkills.filter(s => s.id !== skill.id));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleContinue = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }

    setSaving(true);
    try {
      // Add all selected skills
      await Promise.all(
        selectedSkills.map(skill =>
          addUserSkill(skill.id, 'teach', 'intermediate')
        )
      );
      toast.success(`Added ${selectedSkills.length} teaching skills!`);
      navigate('/add-learn-skills');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save skills');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <GraduationCap className="w-8 h-8" />
            <h1 className="text-white">Skills I Can Teach</h1>
          </div>
          <p className="text-purple-100 text-sm mb-6">
            Select the skills you're comfortable teaching others
          </p>

          {/* Progress Indicator */}
          <OnboardingProgress
            currentStep={1}
            totalSteps={2}
            steps={[
              { label: 'Teaching Skills', description: 'What you can teach' },
              { label: 'Learning Goals', description: 'What you want to learn' },
            ]}
          />

          <div className="mt-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-sm">
              {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g., Python, Guitar, Excel...)"
              className="pl-10"
            />
          </div>
        </div>

        {/* Selected Skills */}
        {selectedSkills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              Selected Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill)}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:from-purple-700 hover:to-purple-800 transition-all shadow-md"
                >
                  {skill.name}
                  <X className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available Skills */}
        {searchQuery.trim().length > 1 && (
          <div>
            <h3 className="text-gray-900 mb-3">Available Skills</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Searching...
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No skills found for "{searchQuery}"</p>
                <p className="text-xs mt-2">Try a different search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {skills
                  .filter(skill => !selectedSkills.find(s => s.id === skill.id))
                  .map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill)}
                      className="bg-white border-2 border-gray-200 hover:border-purple-600 text-gray-900 px-4 py-3 rounded-xl text-sm transition-all hover:shadow-md"
                    >
                      {skill.name}
                    </button>
                  ))}
              </div>
            )}
          </div>
        )}

        {searchQuery.trim().length <= 1 && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Start typing to search for skills</p>
            <p className="text-xs mt-2">Try: Python, Guitar, Excel, Photography...</p>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            onClick={() => navigate('/login')}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedSkills.length === 0 || saving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              `Continue (${selectedSkills.length})`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
