# Frontend Architecture

> **Warning:** This content is AI inspired.

The frontend is a Next.js (React) application.

## Frontend Modules
```mermaid
graph TD
    App(Next.js App) --> Page(Home Page)
    Page --> UploadZone(UploadZone)
    Page --> ResultsDashboard(ResultsDashboard)
    ResultsDashboard --> MarkerChart(MarkerChart)
    App --> API(API Functions)
```
