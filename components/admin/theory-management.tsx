'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  RefreshCw,
  BookOpen,
  Brain,
  Target,
  Award,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface TheoryQuestion {
  id: number;
  categoryId: number;
  categoryName: string;
  questionType: string;
  difficultyLevel: string;
  questionText: string;
  questionImage?: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation: string;
  officialReference?: string;
  isActive: boolean;
  timesAsked: number;
  timesCorrect: number;
  createdAt: string;
  updatedAt: string;
}

interface TheoryCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  description: string;
  totalQuestions: number;
  passRequirement: number;
  displayOrder: number;
  isActive: boolean;
}

export default function AdminTheoryManagement() {
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [categories, setCategories] = useState<TheoryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Partial<TheoryQuestion> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'questions' | 'categories' | 'cta'>('questions');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<TheoryCategory> | null>(null);
  const [ctaSettings, setCtaSettings] = useState<any>(null);
  const [ctaLoading, setCtaLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadQuestions();
    if (activeTab === 'cta') {
      loadCtaSettings();
    }
  }, [currentPage, selectedCategory, selectedDifficulty, searchTerm, activeTab]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/theory/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(selectedCategory !== 'all' && { categoryId: selectedCategory }),
        ...(selectedDifficulty !== 'all' && { difficulty: selectedDifficulty }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/theory/questions?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.data.questions);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = () => {
    setEditingQuestion({
      categoryId: parseInt(selectedCategory) || categories[0]?.id,
      questionType: 'multiple_choice',
      difficultyLevel: 'foundation',
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
      officialReference: '',
      isActive: true
    });
    setIsEditModalOpen(true);
  };

  const handleEditQuestion = (question: TheoryQuestion) => {
    setEditingQuestion({ ...question });
    setIsEditModalOpen(true);
  };

  const handleSaveQuestion = async () => {
    if (!editingQuestion) return;

    try {
      const method = editingQuestion.id ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/theory/questions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingQuestion)
      });

      const data = await response.json();
      if (data.success) {
        setIsEditModalOpen(false);
        setEditingQuestion(null);
        await loadQuestions();
        alert('Question saved successfully!');
      } else {
        alert('Error saving question: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question');
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/admin/theory/questions?id=${questionId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await loadQuestions();
        alert('Question deleted successfully!');
      } else {
        alert('Error deleting question: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error deleting question');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'foundation': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Category Management Functions
  const handleCreateCategory = () => {
    setEditingCategory({
      categoryCode: '',
      categoryName: '',
      description: '',
      passRequirement: 8,
      displayOrder: 999,
      isActive: true
    });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: TheoryCategory) => {
    setEditingCategory({ ...category });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;

    try {
      const method = editingCategory.id ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/theory/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory)
      });

      const data = await response.json();
      if (data.success) {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        await loadCategories();
        alert('Category saved successfully!');
      } else {
        alert('Error saving category: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated questions.')) return;

    try {
      const response = await fetch(`/api/admin/theory/categories?id=${categoryId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await loadCategories();
        await loadQuestions(); // Refresh questions too
        alert('Category deleted successfully!');
      } else {
        alert('Error deleting category: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  // CTA Management Functions
  const loadCtaSettings = async () => {
    setCtaLoading(true);
    try {
      const response = await fetch('/api/admin/theory/cta');
      const data = await response.json();
      if (data.success) {
        setCtaSettings(data.data);
      } else {
        // If no settings found, set to null to show create option
        setCtaSettings(null);
      }
    } catch (error) {
      console.error('Error loading CTA settings:', error);
      setCtaSettings(null);
    } finally {
      setCtaLoading(false);
    }
  };

  const handleSaveCtaSettings = async () => {
    if (!ctaSettings) return;

    try {
      const response = await fetch('/api/admin/theory/cta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ctaSettings)
      });

      const data = await response.json();
      if (data.success) {
        setCtaSettings(data.data);
        alert('CTA settings saved successfully!');
      } else {
        alert('Error saving CTA settings: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving CTA settings:', error);
      alert('Error saving CTA settings');
    }
  };

  const handleResetCtaSettings = async () => {
    if (!confirm('Are you sure you want to reset CTA settings to defaults?')) return;

    try {
      const response = await fetch('/api/admin/theory/cta', {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await loadCtaSettings();
        alert('CTA settings reset to defaults!');
      } else {
        alert('Error resetting CTA settings: ' + data.error);
      }
    } catch (error) {
      console.error('Error resetting CTA settings:', error);
      alert('Error resetting CTA settings');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Theory Test Management
          </h1>
          <p className="text-gray-600 mt-1">Manage DVSA theory test questions and categories</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadQuestions} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {activeTab === 'questions' ? (
            <Button onClick={handleCreateQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          ) : activeTab === 'categories' ? (
            <Button onClick={handleCreateCategory}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          ) : (
            <Button onClick={handleSaveCtaSettings}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save CTA Settings
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">Questions Management</TabsTrigger>
          <TabsTrigger value="categories">Categories Management</TabsTrigger>
          <TabsTrigger value="cta">CTA Section Management</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{questions.length}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <div className="text-2xl font-bold">
              {questions.filter(q => q.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Questions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">
              {questions.reduce((acc, q) => acc + q.timesAsked, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Attempts</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Questions</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by question text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <select
                id="difficulty"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="foundation">Foundation</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedDifficulty('all');
                  setCurrentPage(1);
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Loading questions...
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No questions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => {
                const accuracy = question.timesAsked > 0 
                  ? (question.timesCorrect / question.timesAsked) * 100 
                  : 0;

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(question.difficultyLevel)}>
                            {question.difficultyLevel}
                          </Badge>
                          <Badge variant="outline">
                            {question.categoryName}
                          </Badge>
                          {!question.isActive && (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                          {question.officialReference && (
                            <Badge variant="outline">
                              {question.officialReference}
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {question.questionText}
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">A:</span> {question.optionA}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">B:</span> {question.optionB}
                          </div>
                          {question.optionC && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">C:</span> {question.optionC}
                            </div>
                          )}
                          {question.optionD && (
                            <div className="flex items-center gap-1">
                              <span className="font-medium">D:</span> {question.optionD}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-green-600">
                            Correct: {question.correctAnswer}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="text-right text-sm">
                          <div className="font-medium">Statistics</div>
                          <div className="text-gray-600">
                            Asked: {question.timesAsked}
                          </div>
                          <div className={`font-medium ${getAccuracyColor(accuracy)}`}>
                            Accuracy: {accuracy.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleEditQuestion(question)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteQuestion(question.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              <span className="flex items-center px-3 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Question Modal */}
      {isEditModalOpen && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingQuestion.id ? 'Edit Question' : 'Add New Question'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={editingQuestion.categoryId || ''}
                    onChange={(e) => setEditingQuestion({ 
                      ...editingQuestion, 
                      categoryId: parseInt(e.target.value) 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select
                    id="difficulty"
                    value={editingQuestion.difficultyLevel || 'foundation'}
                    onChange={(e) => setEditingQuestion({ 
                      ...editingQuestion, 
                      difficultyLevel: e.target.value 
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="foundation">Foundation</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  value={editingQuestion.questionText || ''}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    questionText: e.target.value 
                  })}
                  placeholder="Enter the question text..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="questionImage">Question Image URL (Optional)</Label>
                <Input
                  id="questionImage"
                  value={editingQuestion.questionImage || ''}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    questionImage: e.target.value 
                  })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="optionA">Option A</Label>
                  <Input
                    id="optionA"
                    value={editingQuestion.optionA || ''}
                    onChange={(e) => setEditingQuestion({ 
                      ...editingQuestion, 
                      optionA: e.target.value 
                    })}
                    placeholder="Option A text"
                  />
                </div>
                
                <div>
                  <Label htmlFor="optionB">Option B</Label>
                  <Input
                    id="optionB"
                    value={editingQuestion.optionB || ''}
                    onChange={(e) => setEditingQuestion({ 
                      ...editingQuestion, 
                      optionB: e.target.value 
                    })}
                    placeholder="Option B text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="optionC">Option C (Optional)</Label>
                  <Input
                    id="optionC"
                    value={editingQuestion.optionC || ''}
                    onChange={(e) => setEditingQuestion({ 
                      ...editingQuestion, 
                      optionC: e.target.value 
                    })}
                    placeholder="Option C text"
                  />
                </div>
                
                <div>
                  <Label htmlFor="optionD">Option D (Optional)</Label>
                  <Input
                    id="optionD"
                    value={editingQuestion.optionD || ''}
                    onChange={(e) => setEditingQuestion({ 
                      ...editingQuestion, 
                      optionD: e.target.value 
                    })}
                    placeholder="Option D text"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="correctAnswer">Correct Answer</Label>
                <select
                  id="correctAnswer"
                  value={editingQuestion.correctAnswer || 'A'}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    correctAnswer: e.target.value 
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div>
                <Label htmlFor="explanation">Explanation</Label>
                <Textarea
                  id="explanation"
                  value={editingQuestion.explanation || ''}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    explanation: e.target.value 
                  })}
                  placeholder="Explain why this is the correct answer..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="officialReference">Official Reference (e.g., Highway Code Rule)</Label>
                <Input
                  id="officialReference"
                  value={editingQuestion.officialReference || ''}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    officialReference: e.target.value 
                  })}
                  placeholder="e.g., HC Rule 123"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingQuestion.isActive !== false}
                  onChange={(e) => setEditingQuestion({ 
                    ...editingQuestion, 
                    isActive: e.target.checked 
                  })}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active (visible to students)</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingQuestion(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveQuestion}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {/* Categories List */}
          <Card>
            <CardHeader>
              <CardTitle>Theory Categories</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading categories...</div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                              {category.categoryCode}
                            </Badge>
                            <h3 className="font-semibold">{category.categoryName}</h3>
                            <Badge variant="outline">
                              {category.totalQuestions} questions
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-2">{category.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>Pass Requirement: {category.passRequirement} correct</span>
                            <span>Display Order: {category.displayOrder}</span>
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                              {category.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta" className="space-y-6">
          {/* CTA Section Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Theory Test CTA Section Settings
                <div className="flex items-center gap-2">
                  {!ctaSettings && !ctaLoading && (
                    <Button 
                      onClick={() => {
                        // Create default CTA settings
                        setCtaSettings({
                          id: null,
                          isActive: true,
                          title: 'Pass Your Theory Test Today',
                          subtitle: 'Master the DVSA theory test with our comprehensive practice questions. Study all 15 official categories and boost your confidence before the real exam.',
                          buttonText: 'Take The Test',
                          buttonUrl: '/theory',
                          stat1Icon: 'CheckCircle',
                          stat1Text: '15 Official DVSA Categories',
                          stat1Count: 15,
                          stat2Icon: 'BookOpen',
                          stat2Text: '50+ Practice Questions',
                          stat2Count: 50,
                          stat3Icon: 'Star',
                          stat3Text: 'Real Exam Experience',
                          stat3Count: null,
                          footerText: 'Free practice • No registration required',
                          backgroundGradientFrom: 'blue-600',
                          backgroundGradientVia: 'blue-500',
                          backgroundGradientTo: 'green-500',
                          showDecorations: true,
                          minHeight: 'min-h-96'
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New
                    </Button>
                  )}
                  <Button 
                    onClick={handleResetCtaSettings} 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ctaLoading ? (
                <div className="text-center py-8">Loading CTA settings...</div>
              ) : ctaSettings ? (
                <div className="space-y-6">
                  {/* Main Settings */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ctaIsActive"
                          checked={ctaSettings.isActive || false}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            isActive: e.target.checked
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="ctaIsActive">Section Active (visible on homepage)</Label>
                      </div>

                      <div>
                        <Label htmlFor="ctaTitle">Main Title</Label>
                        <Input
                          id="ctaTitle"
                          value={ctaSettings.title || ''}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            title: e.target.value
                          })}
                          placeholder="Pass Your Theory Test Today"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ctaSubtitle">Subtitle</Label>
                        <Textarea
                          id="ctaSubtitle"
                          value={ctaSettings.subtitle || ''}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            subtitle: e.target.value
                          })}
                          placeholder="Master the DVSA theory test with our comprehensive practice questions..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ctaButtonText">Button Text</Label>
                          <Input
                            id="ctaButtonText"
                            value={ctaSettings.buttonText || ''}
                            onChange={(e) => setCtaSettings({
                              ...ctaSettings,
                              buttonText: e.target.value
                            })}
                            placeholder="Take The Test"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ctaButtonUrl">Button URL</Label>
                          <Input
                            id="ctaButtonUrl"
                            value={ctaSettings.buttonUrl || ''}
                            onChange={(e) => setCtaSettings({
                              ...ctaSettings,
                              buttonUrl: e.target.value
                            })}
                            placeholder="/theory"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="ctaFooterText">Footer Text</Label>
                        <Input
                          id="ctaFooterText"
                          value={ctaSettings.footerText || ''}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            footerText: e.target.value
                          })}
                          placeholder="Free practice • No registration required"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Statistics Settings */}
                      <h3 className="text-lg font-semibold">Statistics Display</h3>
                      
                      {/* Stat 1 */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Statistic 1</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="stat1Icon">Icon</Label>
                            <select
                              id="stat1Icon"
                              value={ctaSettings.stat1Icon || 'CheckCircle'}
                              onChange={(e) => setCtaSettings({
                                ...ctaSettings,
                                stat1Icon: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="CheckCircle">CheckCircle</option>
                              <option value="BookOpen">BookOpen</option>
                              <option value="Star">Star</option>
                              <option value="Award">Award</option>
                              <option value="Target">Target</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="stat1Count">Count (optional)</Label>
                            <Input
                              id="stat1Count"
                              type="number"
                              value={ctaSettings.stat1Count || ''}
                              onChange={(e) => setCtaSettings({
                                ...ctaSettings,
                                stat1Count: e.target.value ? parseInt(e.target.value) : null
                              })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="stat1Text">Text</Label>
                          <Input
                            id="stat1Text"
                            value={ctaSettings.stat1Text || ''}
                            onChange={(e) => setCtaSettings({
                              ...ctaSettings,
                              stat1Text: e.target.value
                            })}
                            placeholder="15 Official DVSA Categories"
                          />
                        </div>
                      </div>

                      {/* Stat 2 */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Statistic 2</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="stat2Icon">Icon</Label>
                            <select
                              id="stat2Icon"
                              value={ctaSettings.stat2Icon || 'BookOpen'}
                              onChange={(e) => setCtaSettings({
                                ...ctaSettings,
                                stat2Icon: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="CheckCircle">CheckCircle</option>
                              <option value="BookOpen">BookOpen</option>
                              <option value="Star">Star</option>
                              <option value="Award">Award</option>
                              <option value="Target">Target</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="stat2Count">Count (optional)</Label>
                            <Input
                              id="stat2Count"
                              type="number"
                              value={ctaSettings.stat2Count || ''}
                              onChange={(e) => setCtaSettings({
                                ...ctaSettings,
                                stat2Count: e.target.value ? parseInt(e.target.value) : null
                              })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="stat2Text">Text</Label>
                          <Input
                            id="stat2Text"
                            value={ctaSettings.stat2Text || ''}
                            onChange={(e) => setCtaSettings({
                              ...ctaSettings,
                              stat2Text: e.target.value
                            })}
                            placeholder="50+ Practice Questions"
                          />
                        </div>
                      </div>

                      {/* Stat 3 */}
                      <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Statistic 3</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="stat3Icon">Icon</Label>
                            <select
                              id="stat3Icon"
                              value={ctaSettings.stat3Icon || 'Star'}
                              onChange={(e) => setCtaSettings({
                                ...ctaSettings,
                                stat3Icon: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="CheckCircle">CheckCircle</option>
                              <option value="BookOpen">BookOpen</option>
                              <option value="Star">Star</option>
                              <option value="Award">Award</option>
                              <option value="Target">Target</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="stat3Count">Count (optional)</Label>
                            <Input
                              id="stat3Count"
                              type="number"
                              value={ctaSettings.stat3Count || ''}
                              onChange={(e) => setCtaSettings({
                                ...ctaSettings,
                                stat3Count: e.target.value ? parseInt(e.target.value) : null
                              })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="stat3Text">Text</Label>
                          <Input
                            id="stat3Text"
                            value={ctaSettings.stat3Text || ''}
                            onChange={(e) => setCtaSettings({
                              ...ctaSettings,
                              stat3Text: e.target.value
                            })}
                            placeholder="Real Exam Experience"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Styling Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Styling Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="bgGradientFrom">Gradient From</Label>
                        <select
                          id="bgGradientFrom"
                          value={ctaSettings.backgroundGradientFrom || 'blue-600'}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            backgroundGradientFrom: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="blue-600">Blue 600</option>
                          <option value="purple-600">Purple 600</option>
                          <option value="green-600">Green 600</option>
                          <option value="red-600">Red 600</option>
                          <option value="yellow-600">Yellow 600</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="bgGradientVia">Gradient Via</Label>
                        <select
                          id="bgGradientVia"
                          value={ctaSettings.backgroundGradientVia || 'blue-500'}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            backgroundGradientVia: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="blue-500">Blue 500</option>
                          <option value="purple-500">Purple 500</option>
                          <option value="green-500">Green 500</option>
                          <option value="red-500">Red 500</option>
                          <option value="yellow-500">Yellow 500</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="bgGradientTo">Gradient To</Label>
                        <select
                          id="bgGradientTo"
                          value={ctaSettings.backgroundGradientTo || 'green-500'}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            backgroundGradientTo: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="green-500">Green 500</option>
                          <option value="blue-500">Blue 500</option>
                          <option value="purple-500">Purple 500</option>
                          <option value="red-500">Red 500</option>
                          <option value="yellow-500">Yellow 500</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id="showDecorations"
                          checked={ctaSettings.showDecorations !== false}
                          onChange={(e) => setCtaSettings({
                            ...ctaSettings,
                            showDecorations: e.target.checked
                          })}
                          className="rounded"
                        />
                        <Label htmlFor="showDecorations">Show Decorations</Label>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <div className={`relative w-full ${ctaSettings.minHeight || 'min-h-96'} bg-gradient-to-r from-${ctaSettings.backgroundGradientFrom || 'blue-600'} via-${ctaSettings.backgroundGradientVia || 'blue-500'} to-${ctaSettings.backgroundGradientTo || 'green-500'} py-20 rounded-lg`}>
                      <div className="container mx-auto px-4 text-center">
                        <div className="max-w-4xl mx-auto">
                          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            {ctaSettings.title || 'Pass Your Theory Test Today'}
                          </h2>
                          <p className="text-xl lg:text-2xl text-white opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                            {ctaSettings.subtitle || 'Master the DVSA theory test with our comprehensive practice questions. Study all 15 official categories and boost your confidence before the real exam.'}
                          </p>
                          
                          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-10">
                            <div className="flex items-center text-white opacity-90">
                              <span className="text-lg font-medium">{ctaSettings.stat1Text || '15 Official DVSA Categories'}</span>
                            </div>
                            <div className="flex items-center text-white opacity-90">
                              <span className="text-lg font-medium">{ctaSettings.stat2Text || '50+ Practice Questions'}</span>
                            </div>
                            <div className="flex items-center text-white opacity-90">
                              <span className="text-lg font-medium">{ctaSettings.stat3Text || 'Real Exam Experience'}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg shadow-lg">
                              {ctaSettings.buttonText || 'Take The Test'}
                            </div>
                            <p className="text-white opacity-80 text-sm">
                              {ctaSettings.footerText || 'Free practice • No registration required'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No CTA settings found</p>
                  <Button 
                    onClick={() => {
                      // Create default CTA settings
                      setCtaSettings({
                        id: null,
                        isActive: true,
                        title: 'Pass Your Theory Test Today',
                        subtitle: 'Master the DVSA theory test with our comprehensive practice questions. Study all 15 official categories and boost your confidence before the real exam.',
                        buttonText: 'Take The Test',
                        buttonUrl: '/theory',
                        stat1Icon: 'CheckCircle',
                        stat1Text: '15 Official DVSA Categories',
                        stat1Count: 15,
                        stat2Icon: 'BookOpen',
                        stat2Text: '50+ Practice Questions',
                        stat2Count: 50,
                        stat3Icon: 'Star',
                        stat3Text: 'Real Exam Experience',
                        stat3Count: null,
                        footerText: 'Free practice • No registration required',
                        backgroundGradientFrom: 'blue-600',
                        backgroundGradientVia: 'blue-500',
                        backgroundGradientTo: 'green-500',
                        showDecorations: true,
                        minHeight: 'min-h-96'
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New CTA Section
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Edit Modal */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingCategory.id ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="categoryCode">Category Code *</Label>
                  <Input
                    id="categoryCode"
                    value={editingCategory.categoryCode || ''}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      categoryCode: e.target.value
                    })}
                    placeholder="e.g., ALERT"
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={editingCategory.displayOrder || 999}
                    onChange={(e) => setEditingCategory({
                      ...editingCategory,
                      displayOrder: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="categoryName">Category Name *</Label>
                <Input
                  id="categoryName"
                  value={editingCategory.categoryName || ''}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    categoryName: e.target.value
                  })}
                  placeholder="e.g., Alertness"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    description: e.target.value
                  })}
                  placeholder="Describe what this category covers..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="passRequirement">Pass Requirement (correct answers needed)</Label>
                <Input
                  id="passRequirement"
                  type="number"
                  min="1"
                  max="50"
                  value={editingCategory.passRequirement || 8}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    passRequirement: parseInt(e.target.value)
                  })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActiveCategory"
                  checked={editingCategory.isActive !== false}
                  onChange={(e) => setEditingCategory({
                    ...editingCategory,
                    isActive: e.target.checked
                  })}
                  className="rounded"
                />
                <Label htmlFor="isActiveCategory">Active (visible to students)</Label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveCategory}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Category
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}