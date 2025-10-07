'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
  PoundSterling
} from 'lucide-react';

interface CustomCourseSettings {
  id?: number;
  title: string;
  description: string | null;
  hourlyRate: string;
  minHours: number;
  maxHours: number;
  isActive: boolean;
  cardColor: string;
  cardIcon: string;
}

interface CustomSkill {
  id: number;
  skillId: string;
  name: string;
  category: string;
  description: string;
  isActive: boolean;
  displayOrder: number;
}

const skillCategories = [
  { value: 'safety', label: 'Safety & Awareness', color: 'bg-red-100 text-red-800' },
  { value: 'control', label: 'Vehicle Control', color: 'bg-blue-100 text-blue-800' },
  { value: 'manoeuvres', label: 'Manoeuvres', color: 'bg-green-100 text-green-800' },
  { value: 'navigation', label: 'Navigation', color: 'bg-purple-100 text-purple-800' },
];

const cardColors = [
  { value: 'orange', label: 'Orange', preview: 'bg-orange-500' },
  { value: 'blue', label: 'Blue', preview: 'bg-blue-500' },
  { value: 'green', label: 'Green', preview: 'bg-green-500' },
  { value: 'purple', label: 'Purple', preview: 'bg-purple-500' },
  { value: 'red', label: 'Red', preview: 'bg-red-500' },
];

export default function CustomCourseAdmin() {
  const [settings, setSettings] = useState<CustomCourseSettings>({
    title: 'Custom Course',
    description: 'Build your personalized driving course',
    hourlyRate: '30.00',
    minHours: 1,
    maxHours: 10,
    isActive: true,
    cardColor: 'orange',
    cardIcon: 'settings',
  });
  const [skills, setSkills] = useState<CustomSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditingSkill, setIsEditingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Partial<CustomSkill> | null>(null);

  useEffect(() => {
    loadCustomCourseData();
  }, []);

  const loadCustomCourseData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/custom-course');
      const data = await response.json();
      
      if (data.success) {
        if (data.data.settings) {
          setSettings(data.data.settings);
        }
        setSkills(data.data.skills || []);
      }
    } catch (error) {
      console.error('Error loading custom course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/custom-course', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
        alert('Settings saved successfully!');
      } else {
        alert('Error saving settings: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const saveSkill = async () => {
    if (!editingSkill) return;

    setSaving(true);
    try {
      const method = editingSkill.id ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/custom-course/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSkill),
      });

      const data = await response.json();
      if (data.success) {
        await loadCustomCourseData();
        setIsEditingSkill(false);
        setEditingSkill(null);
        alert('Skill saved successfully!');
      } else {
        alert('Error saving skill: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Error saving skill');
    } finally {
      setSaving(false);
    }
  };

  const deleteSkill = async (skillId: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/custom-course/skills?id=${skillId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        await loadCustomCourseData();
        alert('Skill deleted successfully!');
      } else {
        alert('Error deleting skill: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill');
    } finally {
      setSaving(false);
    }
  };

  const startEditingSkill = (skill?: CustomSkill) => {
    if (skill) {
      setEditingSkill({ ...skill });
    } else {
      setEditingSkill({
        skillId: '',
        name: '',
        category: 'safety',
        description: '',
        isActive: true,
        displayOrder: skills.length,
      });
    }
    setIsEditingSkill(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading custom course data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Custom Course Management
          </h1>
          <p className="text-gray-600 mt-1">Configure custom course settings and skills</p>
        </div>
        <Button onClick={loadCustomCourseData} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Course Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Course Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                placeholder="Custom Course"
              />
            </div>
            <div>
              <Label htmlFor="hourlyRate">Hourly Rate (£)</Label>
              <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  value={settings.hourlyRate}
                  onChange={(e) => setSettings({ ...settings, hourlyRate: e.target.value })}
                  className="pl-10"
                  placeholder="30.00"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.description || ''}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              placeholder="Build your personalized driving course"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="minHours">Minimum Hours</Label>
              <Input
                id="minHours"
                type="number"
                value={settings.minHours}
                onChange={(e) => setSettings({ ...settings, minHours: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="maxHours">Maximum Hours</Label>
              <Input
                id="maxHours"
                type="number"
                value={settings.maxHours}
                onChange={(e) => setSettings({ ...settings, maxHours: parseInt(e.target.value) || 10 })}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="cardColor">Card Color</Label>
              <select
                id="cardColor"
                value={settings.cardColor}
                onChange={(e) => setSettings({ ...settings, cardColor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {cardColors.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={settings.isActive}
              onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isActive">Active (Show on frontend)</Label>
          </div>

          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Skills Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Driving Skills</CardTitle>
          <Button onClick={() => startEditingSkill()} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{skill.name}</h4>
                    <Badge className={skillCategories.find(c => c.value === skill.category)?.color}>
                      {skillCategories.find(c => c.value === skill.category)?.label}
                    </Badge>
                    {!skill.isActive && <Badge variant="secondary">Inactive</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{skill.description}</p>
                  <p className="text-xs text-gray-400 mt-1">ID: {skill.skillId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => startEditingSkill(skill)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => deleteSkill(skill.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {skills.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No skills configured yet</p>
                <p className="text-sm">Add skills to build the custom course options</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Skill Edit Modal */}
      {isEditingSkill && editingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingSkill.id ? 'Edit Skill' : 'Add New Skill'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="skillId">Skill ID</Label>
                <Input
                  id="skillId"
                  value={editingSkill.skillId || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, skillId: e.target.value })}
                  placeholder="e.g., parallel-parking"
                  disabled={!!editingSkill.id}
                />
              </div>
              
              <div>
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  value={editingSkill.name || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g., Parallel Parking"
                />
              </div>

              <div>
                <Label htmlFor="skillCategory">Category</Label>
                <select
                  id="skillCategory"
                  value={editingSkill.category || 'safety'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {skillCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="skillDescription">Description</Label>
                <Textarea
                  id="skillDescription"
                  value={editingSkill.description || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, description: e.target.value })}
                  placeholder="Describe what this skill covers"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="skillActive"
                  checked={editingSkill.isActive !== false}
                  onChange={(e) => setEditingSkill({ ...editingSkill, isActive: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="skillActive">Active</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  onClick={() => {
                    setIsEditingSkill(false);
                    setEditingSkill(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={saveSkill} disabled={saving}>
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Skill
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}