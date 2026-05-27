Bready to Go!

Bready to Go! is a full-stack e-commerce shopping cart web app for a bakery. Users can register, browse and search for products in real time, add items to their cart, and manage their orders. Admins have a dedicated dashboard to view and manage all users' shopping carts and products across the platform.

Technical stack:
- Frontend: React with Vite and React Router
- Backend: FastAPI (Python)
- Database: MongoDB Atlas
- Authentication: JWT (JSON Web Tokens) and bcrypt password hashing
- Database driver: Motor (async MongoDB driver)

Create a .env file in the root directory with the following:

MONGO_URL=mongodb+srv://username:password@cluster0.bb7ui04.mongodb.net/?appName=Cluster0
DB_NAME=at2
SECRET_KEY=key
ALGORITHM=HS256

How to run the backend:
Open a command prompt. Run following commands: 
cd backend
venv\Scripts\activate
uvicorn main:app --reload

How to run the frontend:
cd into the frontend folder
Run npm install
Run npm run dev
Frontend runs at http://localhost:5173

Default admin account:
Email: admin@shop.com
Password: admin123
The following test account can also be used: 
Email: test2@test.com
Password: testing2

Folder structure:
at2-app/
  README.md: project documentation
  backend/
    main.py: FastAPI app entry point, registers all routes and sets up CORS middleware
    auth.py: JWT token creation, decoding, and bcrypt password hashing 
    database.py: MongoDB Atlas connection using Motor async driver
    models.py: Pydantic schemas defining the shape of all request and response data
    seed.py: one-time script to create the default admin account in the database
    requirements.txt: all Python dependencies
    .env: secret config file containing database URL and JWT secret, not committed to GitHub
    routes/
    auth.py: /auth/register and /auth/login endpoints
    products.py: full CRUD endpoints for products including live search
    cart.py: cart CRUD endpoints and admin route to view all users' carts
  frontend/
    package.json: Frontend dependencies and scripts
    vite.config.js: Vite configuration file
    src/
     App.jsx: Main routing configuration using React Router
     api.js: Axios API base configuration
      components/
       Navbar.jsx: Main navigation bar with role-based routing
       ProtectedRoute.jsx: Route protection based on authentication and roles 
      layouts/
       AppLayout.jsx: Shared layout wrapper for consistent UI structure 
      pages/
       Home.jsx: Landing page
       Login.jsx: User authentication page
       Products.jsx: Product listing with search and add-to-cart functionality
       Cart.jsx: User shopping cart management page 
        pages/admin/
         AdminLayout.jsx: Sidebar layout for admin dashboard
         AdminHome.jsx: Admin dashboard overview page
         AdminProducts.jsx: Admin product management (CRUD)
         AdminUsers.jsx: Admin user management view
         AdminCart.jsx: Admin view of all user carts 

Backend dependencies: fastapi, uvicorn, motor, python-jose, passlib, bcrypt==4.0.1, python-dotenv, pydantic

Frontend dependencies: react, react-dom, react-router-dom, axios, vite

Workload allocation:
Heli worked on all backend files and logic. The website is also an extension of the e-commerce shopping cart submission from her Assignment 1. The main files worked  include: 
  backend/main.py
  backend/auth.py
  backend/database.py
  backend/models.py
  backend/seed.py
  backend/requirements.txt
  backend/.env
  backend/routes/init.py
  backend/routes/auth.py
  backend/routes/products.py
  backend/routes/cart.py
  README.md

Deeva wrote all the frontend files. Deeva also made improvements to backend files during integration where required for better error handling and compatibility. The main files worked on include: 
  frontend/src/App.jsx
  frontend/src/pages/Home.jsx
  frontend/src/pages/Login.jsx
  frontend/src/pages/Products.jsx
  frontend/src/pages/Cart.jsx
  frontend/src/pages/admin/AdminHome.jsx
  frontend/src/pages/admin/AdminLayout.jsx
  frontend/src/pages/admin/AdminProducts.jsx
  frontend/src/pages/admin/AdminUsers.jsx
  frontend/src/pages/admin/AdminCart.jsx
  frontend/src/components/Navbar.jsx
  frontend/src/components/ProtectedRoute.jsx
  frontend/src/layouts/AppLayout.jsx
  frontend/src/api.js
  README.md

The workload was divided by layer; Heli built the entire backend and Deeva built the entire frontend, meaning each member could work independently without relying on the other. Both halves are roughly equal in complexity and neither member's work overlaps with the other's. Both members actively contributed in debugging and fixing when required. 


