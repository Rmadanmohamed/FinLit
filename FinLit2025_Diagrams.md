# FinLit2025 Platform Diagrams

## Data Flow Diagram (DFD)

### DFD Level 0 (Context Diagram)

```
+-------------+                                  +-------------+
|             |  Register/Login                 |             |
|    User     | --------------------------->    |  FinLit2025 |
|             |                                  |   Platform  |
|             | <---------------------------    |             |
+-------------+  Assessment Results/            +-------------+
                  Recommendations/                     ^
                  Calculation Results                  |
                                                       |
                                                       |
                                                       v
                                                +-------------+
                                                |             |
                                                |    Admin    |
                                                |             |
                                                +-------------+
                                                 Manage Content/
                                                 View Analytics
```

### DFD Level 1

```
                                +-------------------+
                                |                   |
                                |  User Database    |
                                |                   |
                                +-------------------+
                                        ^   |
                                        |   |
                                        |   v
+-------------+    Register    +-------------------+
|             | ------------> |                   |
|    User     |               | User Registration  |
|             | <------------ |   & Management    |
+-------------+  User Profile +-------------------+
        |                             ^
        |                             |
        |                             |
        |       +-------------------+ |
        |       |                   | |
        |       |  Authentication   | |
        +-----> |      System      | |
        |       |                   | |
        |       +-------------------+ |
        |               |             |
        |               v             |
        |       +-------------------+ |
        |       |                   | |
        +-----> |  Assessment      | |
        |       |     System       | |
        |       |                   | |
        |       +-------------------+ |
        |               |             |
        |               v             |
        |       +-------------------+ |
        |       |                   | |
        +-----> |  Recommendation   | |
        |       |     Engine        | |
        |       |                   | |
        |       +-------------------+ |
        |               |             |
        |               v             |
        |       +-------------------+ |
        |       |                   | |
        +-----> |    Financial     | |
        |       |   Calculators    | |
        |       |                   | |
        |       +-------------------+ |
        |               |             |
        |               v             |
        |       +-------------------+ |
        |       |                   | |
        +-----> |   Educational    | |
        |       |    Resources     | |
        |       |                   | |
        |       +-------------------+ |
        |               |             |
        |               v             |
        |       +-------------------+ |
        |       |                   | |
        +-----> |    Progress      |--+
                |    Tracking      |
                |                   |
                +-------------------+
                        |
                        v
                +-------------------+
                |                   |
                |    Analytics      |
                |    Dashboard      |
                |                   |
                +-------------------+
                        ^
                        |
+-------------+         |
|             |         |
|    Admin    |---------+
|             |
+-------------+
```

## Entity Relationship Diagram (ERD)

```
+---------------+       +----------------+       +----------------+
|     User      |       |   Assessment   |       |  Calculation   |
+---------------+       +----------------+       +----------------+
| PK: id        |<----->| PK: id         |       | PK: id         |
| username      |       | FK: userId     |       | FK: userId     |
| email         |       | digitalScore   |       | calculationType|
| password      |       | financialScore |       | title          |
| createdAt     |       | inclusionScore |       | data (JSON)    |
| savedCalcs[]  |       | totalScore     |       | createdAt      |
+---------------+       | createdAt      |       +----------------+
        |               +----------------+               ^
        |                      ^                         |
        |                      |                         |
        +----------------------+-------------------------+
                               |
                               v
                     +------------------+
                     | Recommendation   |
                     +------------------+
                     | PK: id           |
                     | FK: assessmentId |
                     | category         |
                     | title            |
                     | description      |
                     | resources[]      |
                     +------------------+
                               ^
                               |
                               v
                     +------------------+
                     |    Resource      |
                     +------------------+
                     | PK: id           |
                     | title            |
                     | type             |
                     | content          |
                     | category         |
                     | createdAt        |
                     | updatedAt        |
                     +------------------+
```

## Entity Descriptions

### User
- **id**: Unique identifier for the user
- **username**: User's display name
- **email**: User's email address (used for login)
- **password**: User's password (hashed)
- **createdAt**: Timestamp when the user account was created
- **savedCalculations**: Array of saved calculation results

### Assessment
- **id**: Unique identifier for the assessment
- **userId**: Foreign key referencing the User who took the assessment
- **digitalScore**: Score for digital literacy section (0-100)
- **financialScore**: Score for financial literacy section (0-100)
- **inclusionScore**: Score for financial inclusion section (0-100)
- **totalScore**: Overall assessment score (average of the three scores)
- **createdAt**: Timestamp when the assessment was completed

### Calculation
- **id**: Unique identifier for the calculation
- **userId**: Foreign key referencing the User who created the calculation
- **calculationType**: Type of calculation (budget, loan, savings)
- **title**: User-provided title for the calculation
- **data**: JSON object containing calculation parameters and results
- **createdAt**: Timestamp when the calculation was created

### Recommendation
- **id**: Unique identifier for the recommendation
- **assessmentId**: Foreign key referencing the Assessment that generated this recommendation
- **category**: Category of recommendation (Digital Literacy, Financial Literacy, Financial Inclusion)
- **title**: Title of the recommendation
- **description**: Detailed description of the recommendation
- **resources**: Array of resource references

### Resource
- **id**: Unique identifier for the resource
- **title**: Title of the resource
- **type**: Type of resource (article, guide, video)
- **content**: Content or URL of the resource
- **category**: Category the resource belongs to
- **createdAt**: Timestamp when the resource was created
- **updatedAt**: Timestamp when the resource was last updated