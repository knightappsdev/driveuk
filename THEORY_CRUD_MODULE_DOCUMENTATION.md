# Theory Test CRUD Module Documentation

## Overview
The Theory Test CRUD module provides comprehensive management capabilities for DVSA theory test questions and categories within the admin dashboard.

## Features

### 🎯 Admin Dashboard Integration
- **Location**: `/admin/theory`
- **Navigation**: Integrated into admin sidebar with Brain icon
- **Access Control**: Admin authentication required

### 📊 Dual Management Interface
- **Questions Management Tab**: Full CRUD for theory questions
- **Categories Management Tab**: Full CRUD for theory categories
- **Tabbed Interface**: Easy switching between question and category management

## API Endpoints

### Questions Management
**Base URL**: `/api/admin/theory/questions`

#### GET - Fetch Questions
- **Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `categoryId`: Filter by category ID
  - `difficulty`: Filter by difficulty level
  - `search`: Search in question text
- **Response**: Paginated list of questions with category information

#### POST - Create Question
- **Body**: Question object with all required fields
- **Validation**: Ensures required fields are present
- **Response**: Created question data

#### PUT - Update Question
- **Body**: Question object with ID and updated fields
- **Response**: Updated question data

#### DELETE - Delete Question
- **Parameters**: `id` - Question ID to delete
- **Response**: Success confirmation

### Categories Management
**Base URL**: `/api/admin/theory/categories`

#### GET - Fetch Categories
- **Response**: All categories with question counts and statistics

#### POST - Create Category
- **Body**: Category object with required fields
- **Validation**: Ensures unique category codes
- **Response**: Created category data

#### PUT - Update Category
- **Body**: Category object with ID and updated fields
- **Validation**: Checks for category code conflicts
- **Response**: Updated category data

#### DELETE - Delete Category
- **Parameters**: `id` - Category ID to delete
- **Validation**: Prevents deletion if questions exist
- **Response**: Success confirmation

### Statistics API
**Endpoint**: `/api/admin/theory/stats`

Provides comprehensive statistics including:
- Question and category counts
- Difficulty distribution
- Category performance metrics
- Most challenging questions
- Most popular questions

## User Interface Components

### Questions Management
- **Search & Filter**: By category, difficulty, and text search
- **Pagination**: Efficient handling of large question sets
- **Question Cards**: Display with key information and actions
- **Modal Editor**: Comprehensive form for creating/editing questions

#### Question Form Fields:
- Category selection
- Question type (multiple choice, etc.)
- Difficulty level (foundation, intermediate, advanced)
- Question text
- Multiple choice options (A, B, C, D)
- Correct answer selection
- Explanation text
- Official reference
- Active status toggle

### Categories Management
- **Category List**: Shows all categories with statistics
- **Category Cards**: Display code, name, description, and question counts
- **Modal Editor**: Form for creating/editing categories

#### Category Form Fields:
- Category code (unique identifier)
- Category name
- Description
- Pass requirement (correct answers needed)
- Display order
- Active status

## Key Features

### 🔍 Advanced Search & Filtering
- Real-time search in question text
- Filter by category and difficulty
- Pagination for performance

### 📈 Statistics & Analytics
- Total questions and categories
- Active vs inactive counts
- Question attempt statistics
- Category performance metrics

### 🛡️ Data Validation
- Required field validation
- Unique constraint checking
- Relationship integrity (categories with questions)

### 🎨 User Experience
- Responsive design
- Intuitive tabbed interface
- Modal-based editing
- Confirmation dialogs for deletions
- Loading states and error handling

## Database Schema

### Theory Questions Table (`uk_theory_questions`)
- `id`: Primary key
- `categoryId`: Foreign key to categories
- `questionType`: Type of question (multiple_choice, etc.)
- `difficultyLevel`: foundation, intermediate, advanced
- `questionText`: The actual question
- `questionImage`: Optional image URL
- `optionA`, `optionB`, `optionC`, `optionD`: Answer options
- `correctAnswer`: Correct option (A, B, C, or D)
- `explanation`: Explanation of the correct answer
- `officialReference`: Reference to DVSA materials
- `isActive`: Whether question is active
- `timesAsked`: Statistics tracking
- `timesCorrect`: Statistics tracking
- `createdAt`, `updatedAt`: Timestamps

### Theory Categories Table (`uk_theory_categories`)
- `id`: Primary key
- `categoryCode`: Unique category code (e.g., "ALERT")
- `categoryName`: Display name (e.g., "Alertness")
- `description`: Category description
- `passRequirement`: Number of correct answers needed
- `displayOrder`: Sort order
- `isActive`: Whether category is active
- `createdAt`, `updatedAt`: Timestamps

## Usage Instructions

### For Administrators

#### Managing Questions:
1. Navigate to **Admin Dashboard** → **Theory Tests**
2. Select **Questions Management** tab
3. Use search and filters to find specific questions
4. Click **Add Question** to create new questions
5. Click **Edit** icon on any question to modify
6. Click **Delete** icon to remove questions (with confirmation)

#### Managing Categories:
1. Navigate to **Admin Dashboard** → **Theory Tests**
2. Select **Categories Management** tab
3. View all categories with their statistics
4. Click **Add Category** to create new categories
5. Click **Edit** icon to modify category details
6. Click **Delete** icon to remove categories (validates no questions exist)

### Question Creation Best Practices:
- Write clear, concise questions
- Ensure all options are plausible
- Provide detailed explanations
- Include official DVSA references where possible
- Set appropriate difficulty levels
- Test questions before making them active

### Category Management Best Practices:
- Use official DVSA category codes
- Set realistic pass requirements
- Order categories logically
- Provide clear descriptions
- Maintain consistent naming conventions

## Security & Access Control

- **Authentication Required**: Only authenticated admin users can access
- **Input Validation**: All inputs are validated server-side
- **SQL Injection Protection**: Using Drizzle ORM with parameterized queries
- **CSRF Protection**: Next.js built-in protection
- **Error Handling**: Graceful error handling with user-friendly messages

## Performance Considerations

- **Pagination**: Large datasets are paginated for performance
- **Indexing**: Database indexes on frequently queried fields
- **Caching**: Categories are cached for quick filtering
- **Optimized Queries**: Efficient database queries with joins

## Future Enhancements

### Planned Features:
- Bulk question import/export
- Question versioning system
- Advanced analytics dashboard
- Question difficulty auto-calculation
- Image upload for questions
- Question preview functionality
- Duplicate question detection
- Question scheduling (publish dates)

### Integration Opportunities:
- Student practice analytics
- Instructor feedback system
- Performance tracking
- Automated difficulty adjustment
- AI-powered question generation

## Support & Maintenance

### Regular Tasks:
- Monitor question performance
- Update categories as DVSA guidelines change
- Review and approve new questions
- Clean up unused or poor-performing questions
- Back up question database

### Troubleshooting:
- Check server logs for API errors
- Verify database connections
- Confirm user permissions
- Review error messages in browser console

## Technical Notes

### Dependencies:
- Next.js 15+ for API routes
- Drizzle ORM for database operations
- Tailwind CSS for styling
- Lucide React for icons
- TypeScript for type safety

### File Structure:
```
app/
├── admin/theory/page.tsx (Main admin page)
├── api/admin/theory/
│   ├── questions/route.ts (Questions CRUD)
│   ├── categories/route.ts (Categories CRUD)
│   └── stats/route.ts (Statistics API)
components/admin/
└── theory-management.tsx (Main component)
```

This comprehensive CRUD module provides everything needed to manage the theory test system effectively, with robust features for both questions and categories, proper validation, and an intuitive user interface.