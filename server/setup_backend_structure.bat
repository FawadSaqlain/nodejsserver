@echo off
REM Create directories only if they don't exist
IF NOT EXIST backend\src\config mkdir backend\src\config
IF NOT EXIST backend\src\controllers mkdir backend\src\controllers
IF NOT EXIST backend\src\routes mkdir backend\src\routes
IF NOT EXIST backend\src\middlewares mkdir backend\src\middlewares
IF NOT EXIST backend\src\services mkdir backend\src\services
IF NOT EXIST backend\src\utils mkdir backend\src\utils

REM Create files
type nul > backend\src\config\supabaseClient.js
type nul > backend\src\controllers\authController.js
type nul > backend\src\controllers\studentController.js
type nul > backend\src\controllers\taskController.js
type nul > backend\src\routes\authRoutes.js
type nul > backend\src\routes\studentRoutes.js
type nul > backend\src\routes\taskRoutes.js
type nul > backend\src\middlewares\authMiddleware.js
type nul > backend\src\middlewares\errorHandler.js
type nul > backend\src\services\authService.js
type nul > backend\src\services\studentService.js
type nul > backend\src\services\taskService.js
type nul > backend\src\utils\fileParser.js
type nul > backend\src\app.js
type nul > backend\src\server.js
type nul > backend\.env
type nul > backend\.gitignore
type nul > backend\README.md

REM Initialize npm and install dependencies
cd backend
npm init -y
npm install express dotenv @supabase/supabase-js
npm install --save-dev nodemon

REM Update package.json scripts
powershell -Command "(Get-Content package.json) -replace '\"test\": \"echo \\\"Error: no test specified\\\" && exit 1\"', '\"serve\": \"node src/server.js\",`n    \"dev\": \"nodemon src/server.js\"' | Set-Content package.json"

echo Backend setup complete.
