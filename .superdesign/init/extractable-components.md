# Extractable components

No admin UI primitives exist yet.

Public layout components (Header/Footer) should **NOT** be extracted for admin drafts — admin uses a different shell.

For admin designs, invent:
- AdminSidebar (nav)
- AdminTopbar (search, user menu)
- StatCard, DataTable, FormField, FileDropzone, StatusBadge

Skip extracting marketing Header/Footer into Superdesign components for this task.
