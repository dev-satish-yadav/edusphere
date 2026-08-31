# Frontend Folder Structure Guidelines

Based on the highly scalable architecture from the `app_saayam_web` project, we should implement a flat, heavily modularized folder structure at the root level. This separates UI components, pages, logic, and configurations into distinct, easy-to-navigate directories.

Below is the improved architecture outlining which folders will contain which types of files:

```text
frontend/
│
├── components/         # All React UI components and views
│   ├── Common/         # Reusable global components (Buttons, Inputs, Loaders, Dialogs)
│   ├── Layouts/        # Page wrappers (Header, Footer, Sidebar, Navigation)
│   ├── Dashboard/      # Feature-specific component groups (e.g., charts, cards)
│   └── [Feature]/      # Sub-folders for complex features (e.g., Auth, Modals)
│
├── pages/              # Application Routes / Views
│   ├── index.tsx       # Root landing page
│   ├── login.tsx       # Authentication pages
│   └── [route].tsx     # File-based routing (or route wrappers if using React Router)
│
├── src/                # Core application logic & state management
│   ├── auth/           # Authentication mechanisms and wrappers
│   ├── context/        # React Context providers (Theme, Snackbar, etc.)
│   ├── hooks/          # Custom reusable React hooks (e.g., useFetch, useAuth)
│   ├── services/       # API call definitions and Axios interceptors
│   ├── store/          # Global state management (Zustand/Redux slices)
│   └── helpers/        # Business logic helpers
│
├── interfaces/         # TypeScript definitions
│   ├── models.ts       # Backend entity representations (User, Institution, etc.)
│   └── types.ts        # Shared frontend types (API responses, component props)
│
├── utils/              # Pure utility and formatting functions
│   ├── constants.ts    # Magic strings, enums, layout constants
│   ├── formatters.ts   # Date and currency formatting functions
│   └── validators.ts   # Form validation logic
│
├── config/             # Environment and global configuration
│   ├── index.ts        # Centralized env variable exports
│   └── theme.ts        # Global UI theme configurations
│
└── public/             # Static assets (images, icons, fonts)
```

### Folder Responsibilities:

- **`components/`**: Should ONLY contain `.tsx` UI code and local styles. Group related components into subdirectories (e.g., `components/Header/Header.tsx`).
- **`pages/`**: Should act as the glue. Pages fetch data (using `services/` or `store/`) and pass that data down to `components/`. Pages should contain minimal UI code.
- **`src/`**: The "brain" of the app. This is where API requests happen (`services/`), global variables live (`store/`), and logic is abstracted (`hooks/`). It should rarely contain UI/HTML.
- **`interfaces/`**: By extracting all `interface` and `type` definitions here, you avoid circular dependencies when different components need to import the same type.
- **`utils/` & `config/`**: Separating these makes sure pure helper functions and environment checks can be imported anywhere without bringing in heavy React dependencies.
