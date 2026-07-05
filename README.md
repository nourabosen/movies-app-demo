# 🎬 Movies for Life

A high-performance movie discovery application that allows users to explore trending cinema and save their favorite films. This project was developed as part of a comprehensive deep-dive into modern frontend architecture, integrating real-time data fetching and backend-as-a-service (BaaS) logic.

## 🚀 Features
- **Real-time Movie Discovery**: Search for any movie using the TMDB API.
- **Trending Insights**: View the most searched and trending movies based on community interaction.
- **Favorites System**: Save and track your favorite movies.
- **Optimized Performance**: Implemented with React, Tailwind CSS, and a secure serverless proxy architecture.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Vite
- **Backend/Database**: Appwrite (BaaS)
- **API**: The Movie Database (TMDB)
- **Deployment**: Vercel (including a serverless API route for secure API proxying)

## 🌐 Deployment Note
**Note for users in Egypt**: Due to regional ISP restrictions, `*.netlify.app` domains are currently blocked. If the live demo link does not load, please be assured that the site is fully operational. You can verify this by running the project locally or using a VPN.

---


1. **Clone the repository**:
   ```bash
   git clone https://github.com/nourabosen/movies-app-demo.git
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**:
   Create a `.env` file in the root directory and add the following:
   ```env
   APPWRITE_ENDPOINT=your_appwrite_endpoint
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_DATABASE_ID=your_database_id
   APPWRITE_METRICS_ID=your_metrics_collection_id
   APPWRITE_API_KEY=your_server_api_key
   TMDB_API_KEY=your_tmdb_api_key
   ```
4. **Run the application**:
   ```bash
   npm run dev
   ```

## 📜 Acknowledgments
Special thanks to [JavaScript Mastery](https://www.youtube.com/@javascriptmastery) for the educational resources and tutorial that guided the initial development of this project.

## 🖼️ Assets & Credits
- **Hero Images**: Samuel Regan-Asante via Unsplash.
- **Icons/SVGs**: SVG Repo & Swifticons.
- **UI Components**: Flowbite.
