# SkillSwap Platform

A modern skill exchange platform that connects people who want to learn and teach various skills. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### User Management
- **User Registration & Authentication** - Secure login system with demo credentials
- **Profile Management** - Customizable profiles with photos, location, and availability
- **Privacy Controls** - Public/private profile visibility settings

### Skill Management
- **Skills Offered** - List skills you can teach others
- **Skills Wanted** - Specify skills you want to learn
- **Categorization** - Organize skills by categories (Programming, Languages, Music, etc.)
- **Skill Levels** - Beginner, Intermediate, Advanced, Expert

### Skill Discovery
- **Advanced Search** - Find skills by name, category, level, or location
- **Smart Filtering** - Filter by availability, location, and skill categories
- **User Profiles** - View detailed profiles of skill providers

### Swap Management
- **Request System** - Send skill swap requests with personalized messages
- **Accept/Reject** - Manage incoming swap requests
- **Status Tracking** - Monitor pending, accepted, and completed swaps
- **Cancellation** - Cancel pending requests when needed

### Rating & Feedback
- **Post-Swap Ratings** - Rate completed skill exchanges
- **Feedback System** - Leave detailed feedback for other users
- **Reputation Building** - Build trust through ratings and successful swaps

### Admin Features
- **Dashboard Analytics** - Platform statistics and insights
- **User Management** - Monitor and moderate user accounts
- **Content Moderation** - Review and manage skill listings
- **Platform Reports** - Export user activity and swap statistics

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks + Local Storage
- **Deployment**: Netlify

## 🎨 Design Features

- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Gradient Themes** - Beautiful blue-to-purple gradient color scheme
- **Micro-interactions** - Hover effects and smooth transitions
- **Accessibility** - High contrast ratios and keyboard navigation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skillswap-platform.git
cd skillswap-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials

**Regular User:**
- Email: `sarah@example.com`
- Password: `password`

**Admin User:**
- Email: `admin@skillswap.com`
- Password: `password`

## 📱 Usage

### For Learners
1. **Sign up** and complete your profile
2. **Add skills you want to learn** in the "My Skills" section
3. **Browse available skills** in the "Discover" section
4. **Send swap requests** to skill providers
5. **Manage your requests** in the "Swaps" section

### For Teachers
1. **Add skills you can offer** in the "My Skills" section
2. **Set your availability** (weekends, evenings, flexible)
3. **Receive and review** incoming swap requests
4. **Accept requests** that interest you
5. **Complete swaps** and exchange feedback

### For Admins
1. **Monitor platform statistics** in the admin dashboard
2. **Manage user accounts** and moderate content
3. **Review swap activities** and handle disputes
4. **Generate reports** for platform insights

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Layout/         # Layout components (Header, etc.)
│   ├── Skills/         # Skill-related components
│   ├── Swaps/          # Swap request components
│   ├── Profile/        # Profile management components
│   └── Admin/          # Admin dashboard components
├── views/              # Main application views
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── data/               # Mock data and utilities
└── App.tsx             # Main application component
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features Explained

### Skill Categories
- Programming (React, Python, JavaScript)
- Languages (Spanish, French, Mandarin)
- Music (Guitar, Piano, Singing)
- Creative (Photography, Design, Writing)
- Fitness (Yoga, Personal Training)
- Business (Marketing, Finance, Leadership)

### Availability Options
- Weekdays
- Weekends  
- Evenings
- Mornings
- Flexible

### Swap Request Statuses
- **Pending** - Awaiting response
- **Accepted** - Swap approved and in progress
- **Rejected** - Request declined
- **Completed** - Swap finished successfully
- **Cancelled** - Request cancelled by sender

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/) for fast development
- Styled with [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- Icons provided by [Lucide React](https://lucide.dev/)
- Images from [Pexels](https://pexels.com/) for demo profiles

## 📞 Support

If you have any questions or need help with the platform, please open an issue on GitHub or contact the development team.

---

**Happy Skill Swapping! 🎓✨**