import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Edit2, GraduationCap, Target, Info, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { getMyProfile, getMySkills, signOut, getCurrentUser } from '../utils/supabaseApi';
import { toast } from 'sonner@2.0.3';

export function ProfilePageSupabase() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [teachSkills, setTeachSkills] = useState<any[]>([]);
  const [learnSkills, setLearnSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const profileData = await getMyProfile();
      const skillsData = await getMySkills();

      setProfile(profileData);
      setTeachSkills(skillsData.filter((s: any) => s.type === 'teach'));
      setLearnSkills(skillsData.filter((s: any) => s.type === 'learn'));
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/landing');
    } catch (error: any) {
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Profile not found</p>
          <Button onClick={() => navigate('/home')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl">
            {profile.full_name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white bg-opacity-20 border-white text-white hover:bg-white hover:bg-opacity-30"
              onClick={() => navigate('/add-skills')}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Skills
            </Button>
          </div>
        </div>
        <h2 className="text-white mb-1">{profile.full_name}</h2>
        <p className="text-purple-100">{profile.campus || 'No campus set'}</p>
        {profile.bio && <p className="text-purple-100 text-sm mt-2">{profile.bio}</p>}
      </div>

      {/* I Can Teach */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900">I Can Teach</h3>
        </div>
        {teachSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {teachSkills.map((userSkill, index) => (
              <div
                key={userSkill.id || `teach-${index}`}
                className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
              >
                <span>{userSkill.skill.name}</span>
                <span className="text-xs bg-purple-200 px-2 py-0.5 rounded-full">
                  {userSkill.level}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No teaching skills added yet.{' '}
            <button
              onClick={() => navigate('/add-skills')}
              className="text-purple-600 hover:underline"
            >
              Add some!
            </button>
          </p>
        )}
      </div>

      {/* I Want to Learn */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-pink-600" />
          <h3 className="text-gray-900">I Want to Learn</h3>
        </div>
        {learnSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {learnSkills.map((userSkill, index) => (
              <div
                key={userSkill.id || `learn-${index}`}
                className="bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
              >
                <span>{userSkill.skill.name}</span>
                <span className="text-xs bg-pink-200 px-2 py-0.5 rounded-full">
                  {userSkill.level}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            No learning goals added yet.{' '}
            <button
              onClick={() => navigate('/add-learn-skills')}
              className="text-pink-600 hover:underline"
            >
              Add some!
            </button>
          </p>
        )}
      </div>

      {/* About SkillSwap */}
      <div className="bg-gray-50 rounded-xl p-4 mb-4">
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

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Log Out
      </Button>
    </div>
  );
}
