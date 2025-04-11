# Tour Planning Web Application

A modern web application built with Nuxt.js and TypeScript for managing tours and drivers. The application features a clean, responsive UI with dark mode support and efficient data management.

## Features

### Driver Management
- View a list of all drivers
- Add new drivers with name and location
- Location validation (no numbers allowed)
- Responsive data table with filtering capabilities

### Tour Management
- View all tours in a data table
- Create, update, and delete tours
- Tour attributes:
  - Customer Name
  - Shipment Date
  - Location From
  - Location To
  - Assigned Driver
- Smart driver assignment (only drivers matching the tour's "Location From" can be assigned)

## Technical Stack

- **Frontend Framework**: Nuxt.js 3
- **Language**: TypeScript
- **UI Components**: Shadcn UI
- **State Management**: Pinia
- **Styling**: UnoCSS with Tailwind
- **Form Validation**: Vee-Validate with Zod
- **Data Tables**: TanStack Table
- **Icons**: Lucid
- **Date Handling**: date-fns

## Project Structure

```
├── components/         # Reusable Vue components
│   ├── dataTable/     # Data table components
│   ├── form/          # Form components
│   ├── layout/        # Layout components
│   └── ui/            # UI components
├── pages/             # Application pages
│   ├── drivers/       # Driver management pages
│   └── tours/         # Tour management pages
├── stores/            # Pinia stores
├── types/             # TypeScript type definitions
└── composables/       # Vue composables
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
## Features Implemented

- ✅ Modern, responsive UI with dark mode support
- ✅ Reusable components for forms and data tables
- ✅ Form validation with Zod
- ✅ Efficient data management with Pinia
- ✅ Type-safe development with TypeScript
- ✅ Responsive design for all screen sizes
- ✅ Data filtering and sorting capabilities
- ✅ Clean and maintainable code structure

