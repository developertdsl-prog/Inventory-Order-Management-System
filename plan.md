echo "# Inventory-Order-Management-System" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:developertdsl-prog/Inventory-Order-Management-System.git
git push -u origin main

# github_token removed for security - configure securely

Master Project Prompt: Inventory & Order Management System (IOMS)

Act as a Senior Full-Stack Developer, Software Architect, Project Manager, and GitHub Repository Manager.

I want to develop a complete Inventory & Order Management System (IOMS) with both Frontend and Backend development managed through GitHub using a professional, milestone-based Agile workflow.

1. Project Objectives

Develop a scalable, secure, responsive, and maintainable Inventory & Order Management System.

The application should include:

Authentication and User Management
Role-Based Access Control
Dashboard and Analytics
Product and Category Management
Inventory and Stock Management
Supplier Management
Purchase Management
Customer Management
Sales and Order Management
Reports and Analytics
Notifications and System Settings

First inspect the existing GitHub repository, understand its technology stack, folder structure, database, and existing implementation. Do not unnecessarily overwrite or restructure existing code.

2. Development Milestones

Divide the project into the following 10 GitHub milestones.

M1 – Project Setup & Architecture

Frontend:

Initialize frontend project.
Configure routing and folder structure.
Configure reusable components.
Setup environment configuration.

Backend:

Initialize backend project.
Configure API architecture.
Configure database connection.
Setup environment variables.
Create initial database structure.

Integration:

Establish frontend-backend communication.
Configure API client.
Prepare project documentation.
M2 – Authentication & User Management

Frontend:

Login and registration screens.
User management interface.
Protected routes.
Role-based navigation.

Backend:

Authentication APIs.
Password hashing.
JWT/session management.
User CRUD APIs.
Role and permission management.
M3 – Dashboard & Layout

Frontend:

Responsive dashboard.
Sidebar and navigation.
Dashboard cards.
Charts and recent activity.

Backend:

Dashboard summary APIs.
Total products and orders.
Stock statistics.
Recent order APIs.
Low-stock statistics.
M4 – Product & Category Management

Frontend:

Product listing.
Add/edit product forms.
Category management.
Search and pagination.
Product details.

Backend:

Product CRUD APIs.
Category CRUD APIs.
SKU and barcode validation.
Product image handling.
Search, filtering and pagination.
M5 – Inventory & Stock Management

Frontend:

Inventory listing.
Stock adjustment forms.
Stock movement history.
Low-stock indicators.

Backend:

Stock-in and stock-out APIs.
Stock adjustment APIs.
Stock movement history.
Warehouse management if required.
Inventory validation.
Low-stock alerts.
M6 – Supplier & Purchase Management

Frontend:

Supplier management.
Purchase order interface.
Goods receiving interface.
Purchase history.

Backend:

Supplier CRUD APIs.
Purchase order APIs.
Goods receiving APIs.
Purchase status management.
Automatic stock updates.
M7 – Customer & Order Management

Frontend:

Customer management.
Sales order creation.
Order listing and details.
Order status interface.
Order history.

Backend:

Customer CRUD APIs.
Sales order APIs.
Order processing.
Order status management.
Stock deduction on confirmed orders.
Transaction and validation handling.
M8 – Reports & Analytics

Frontend:

Reports dashboard.
Sales reports.
Purchase reports.
Inventory reports.
Charts and date filters.
Export functionality.

Backend:

Report aggregation APIs.
Sales calculations.
Purchase calculations.
Inventory valuation.
Report filtering and export.
M9 – Notifications & System Settings

Frontend:

Notification interface.
Notification history.
System settings.
User preferences.

Backend:

Notification APIs.
Low-stock notifications.
Order status notifications.
Configuration management.
User preferences APIs.
M10 – Testing, Optimization & Deployment

Frontend:

Component testing.
UI responsiveness testing.
Integration testing.
Performance optimization.

Backend:

API testing.
Unit and integration testing.
Database validation.
Security checks.
Performance optimization.

Final:

Fix all identified bugs.
Production build.
Deployment configuration.
README and API documentation.
Final project verification.

Estimated duration: 45 working days, subject to repository complexity and team capacity.

3. GitHub Project Management

Maintain the GitHub repository professionally throughout the project.

Create all 10 GitHub milestones:

M1 - Project Setup & Architecture
M2 - Authentication & User Management
M3 - Dashboard & Layout
M4 - Product & Category Management
M5 - Inventory & Stock Management
M6 - Supplier & Purchase Management
M7 - Customer & Order Management
M8 - Reports & Analytics
M9 - Notifications & System Settings
M10 - Testing, Optimization & Deployment

For every milestone:

Create separate Frontend issues.
Create separate Backend issues.
Create Database issues where required.
Create Integration issues.
Create Testing issues.
Assign appropriate labels and priorities.
Add issues to their respective milestones.
Define clear acceptance criteria.
Track completion status.
4. GitHub Labels

Create and maintain standardized labels:

frontend
backend
database
api
integration
testing
bug
enhancement
documentation
priority-high
priority-medium
priority-low
blocked
5. Git Branching Strategy

Use the following branching structure:

main: Production-ready code.
develop: Development integration branch.
feature/M1-project-setup
feature/M2-auth-frontend
feature/M2-auth-backend
feature/M3-dashboard-frontend
feature/M3-dashboard-backend
feature/M4-products-frontend
feature/M4-products-backend

Continue the same convention for all remaining milestones.

For every issue:

Create an appropriate feature branch.
Link the branch to its GitHub issue.
Implement the task.
Commit changes using meaningful messages.
Push the branch to GitHub.
Create a Pull Request against develop.
Review and test the changes.
Merge only after successful verification.
Close the associated issue.

Never push feature development directly to main.

6. Commit Message Standards

Follow Conventional Commits:

feat: new functionality
fix: bug fixes
docs: documentation changes
refactor: code improvements
test: testing changes
chore: configuration and maintenance

Examples:

feat: implement authentication API
feat: add product management UI
fix: resolve inventory stock calculation
test: add order management tests
docs: update project setup documentation

Include GitHub issue references wherever applicable.

7. Development Standards

Follow these rules throughout development:

Maintain clean and modular code.
Follow existing project conventions.
Use reusable frontend components.
Keep backend business logic separate from controllers/routes.
Implement proper input validation.
Implement appropriate error handling.
Secure APIs and protected routes.
Use database transactions for critical inventory and order operations.
Prevent invalid or negative stock operations.
Maintain consistent API response structures.
Write tests for important functionality.
Update documentation whenever necessary.
Never commit secrets, passwords, tokens, or .env files.
Avoid unnecessary dependencies and code duplication.
8. Milestone Completion Criteria

A milestone is complete only when:

Frontend implementation is finished.
Backend implementation is finished.
Database changes are completed.
Frontend and backend are integrated.
APIs are verified.
Tests pass.
Pull Requests are reviewed and merged.
Associated GitHub issues are closed.
Documentation is updated.
9. Execution Instructions

Work milestone by milestone.

Do not start implementing all modules simultaneously.

For each milestone:

Analyze requirements.
Break down tasks into GitHub issues.
Create milestone and assign issues.
Create appropriate branches.
Implement frontend functionality.
Implement backend functionality.
Integrate frontend and backend.
Test all functionality.
Commit and push changes.
Create and merge Pull Requests.
Update issue and milestone progress.
Proceed to the next milestone.

Do not mark tasks complete without verification.

10. Initial Action Required

Once I provide the GitHub repository URL and configure the required access:

Inspect the complete repository.
Identify the existing frontend and backend technologies.
Review the current folder structure and database schema.
Identify existing completed and pending features.
Prepare the final technical architecture.
Create all 10 GitHub milestones.
Create detailed frontend and backend issues under each milestone.
Configure labels and branching conventions.
Prepare the first development milestone.
Begin development only after reviewing the project plan.

Important:

Do not assume the technology stack before inspecting the repository.
Do not delete existing code without approval.
Do not expose or commit GitHub access tokens.
Use secure, minimum-permission GitHub access.
Ask for confirmation before destructive repository operations or major architectural changes.

Final Goal: Deliver a fully functional Inventory & Order Management System with professional frontend and backend implementation, properly maintained GitHub milestones, issues, branches, commits, pull requests, testing, and documentation.