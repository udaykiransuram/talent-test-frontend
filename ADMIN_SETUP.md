# Admin Dashboard Setup Guide

## 🎉 Your Admin Dashboard is Ready!

The complete Content Management System has been created with realistic seed data.

## Getting Started

### 1. Seed the Database
Run this command to populate your database with realistic content:
```bash
# Visit this URL in your browser after starting the dev server:
http://localhost:3000/api/seed
```

Or use curl:
```bash
curl http://localhost:3000/api/seed
```

### 2. Access the Admin Dashboard
Navigate to:
```
http://localhost:3000/admin
```

## What You Can Manage

### 📊 Site Statistics (`/admin/stats`)
Manage numbers displayed across your website:
- **Homepage**: Students tested, schools, accuracy, time saved
- **About Page**: Founded year, schools served, students impacted, states
- **Case Study Header**: Schools served, improvement %, students, satisfaction
- **Benefits**: Time saved, better results, parent engagement, efficiency

### 💬 Testimonials (`/admin/testimonials`)
Manage customer reviews and quotes:
- Homepage testimonials
- Benefits page reviews
- Case study stories
- Product page quotes

### 🏫 Case Studies (`/admin/case-studies`)
Manage school success stories:
- School name, location, student count
- Challenge description
- Solution implemented
- Results achieved (bullet points)
- Metrics (before/after/improvement)
- Optional testimonial quote
- Featured flag, active status

### 💰 Pricing Plans (`/admin/pricing`)
Configure pricing tiers:
- Plan name, description
- Price, currency, billing period
- Features list
- Student limits
- Popular flag, active status

## Pre-loaded Realistic Content

### Stats
- 50,000+ students tested
- 500+ schools
- 99.5% diagnostic accuracy
- 40% teacher time saved
- And more across different sections

### Testimonials (5 total)
- Dr. Rajesh Kumar - Delhi Public School Principal
- Priya Sharma - Parent from Mumbai
- Anita Desai - Academic Coordinator, Bangalore
- Suresh Menon - Vice Principal, Pune
- Kavita Singh - School Director, Hyderabad

### Case Studies (3 detailed stories)
1. **St. Xavier's High School, Mumbai**
   - 1,200 students
   - Math scores improved 62% → 78% (+26%)
   - Bottom quartile improved 35%

2. **Bangalore International School**
   - 2,400 students
   - 60% admin time saved
   - Parent satisfaction: 72% → 91%

3. **Delhi Public School Sector 45, Gurgaon**
   - 3,200 students
   - Board exam pass rate: 87% → 94%
   - Students scoring 90%+: 45% → 62%

### Pricing Plans (3 tiers)
1. **Starter**: ₹50,000/year - Up to 200 students
2. **Professional**: ₹1,50,000/year - Up to 1000 students (Most Popular)
3. **Enterprise**: ₹4,00,000/year - Unlimited students

## Features

### ✅ Complete CRUD Operations
- Create new entries
- Edit existing content
- Delete unwanted items
- Activate/deactivate content

### ✅ User-Friendly Interface
- Form-based editing
- Inline actions
- Loading states
- Success/error notifications
- Visual status indicators

### ✅ Flexible Content
- Add/remove dynamic fields
- Reorder content (displayOrder)
- Feature important items
- Filter by section/category

## Next Steps

### 1. Test the Admin Dashboard
- Visit `/admin` to see the dashboard
- Try editing some stats
- Create a new testimonial
- Modify a case study

### 2. Integrate with Frontend
Update your frontend pages to fetch from the API instead of using hardcoded data:

**Example for Homepage Stats:**
```typescript
// In your page.tsx
const [stats, setStats] = useState([]);

useEffect(() => {
  fetch('/api/admin/stats?section=homepage')
    .then(res => res.json())
    .then(data => setStats(data.stats || []));
}, []);
```

### 3. Add Authentication (Optional)
Protect your admin routes:
- Use NextAuth.js for session management
- Add middleware to check authentication
- Create admin user accounts

### 4. Advanced Features (Optional)
- Image upload for testimonials/case studies
- Bulk import/export
- Draft mode (preview before publishing)
- Version history
- Search and filters

## API Endpoints Reference

### Stats
- `GET /api/admin/stats?section=homepage`
- `POST /api/admin/stats`
- `DELETE /api/admin/stats?section=homepage`

### Testimonials
- `GET /api/admin/testimonials?section=homepage`
- `POST /api/admin/testimonials`
- `GET /api/admin/testimonials/[id]`
- `PUT /api/admin/testimonials/[id]`
- `DELETE /api/admin/testimonials/[id]`

### Case Studies
- `GET /api/admin/case-studies`
- `POST /api/admin/case-studies`
- `GET /api/admin/case-studies/[id]`
- `PUT /api/admin/case-studies/[id]`
- `DELETE /api/admin/case-studies/[id]`

### Pricing
- `GET /api/admin/pricing`
- `POST /api/admin/pricing`
- `GET /api/admin/pricing/[id]`
- `PUT /api/admin/pricing/[id]`
- `DELETE /api/admin/pricing/[id]`

## Troubleshooting

### Database Connection Error
Check your `.env` file has:
```
MONGODB_URI=mongodb+srv://...
```

### Toast Notifications Not Showing
The Toaster component should be in your root layout. Check `/src/app/layout.tsx`.

### Content Not Updating
1. Check browser console for errors
2. Verify MongoDB connection
3. Check API route responses
4. Ensure models are properly imported

## Support
Need help? Check the console logs or API responses for detailed error messages.
