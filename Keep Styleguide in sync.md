Implement an automatic synchronization mechanism for the Styleguide page.

--------------------------------------------------

# Context

The Styleguide is generated based on:

- /home/azjob/workspace/app-pin/src/utility.scss
- /home/azjob/workspace/app-pin/src/standard-class.scss
- /home/azjob/workspace/app-pin/src/app/shared/components

These sources are constantly evolving.

--------------------------------------------------

# Objective

Ensure that whenever something is:

- Added
- Updated
- Removed

in any of these sources, the Styleguide page is automatically updated to reflect the changes.

--------------------------------------------------

# Step 1 — Detect Changes

Track changes in:

1. utility.scss
2. standard-class.scss
3. shared/components folder

Changes include:

- new classes
- removed classes
- updated properties
- new components
- removed components
- updated component APIs (inputs/outputs)

--------------------------------------------------

# Step 2 — Update Utilities Section

When utility.scss or standard-class.scss changes:

- Re-parse all classes
- Update categories (spacing, flexbox, typography, etc.)
- Update class tables
- Update visual examples
- Remove deleted classes from the styleguide

--------------------------------------------------

# Step 3 — Update Components Section

When shared/components changes:

- Detect new components → add to sidebar
- Detect removed components → remove from sidebar
- Detect updated components → update:

  - demo
  - inputs/outputs
  - code examples

--------------------------------------------------

# Step 4 — Dynamic Rendering (Preferred)

The Styleguide should NOT be static.

It must dynamically read:

- utility classes
- component metadata

Use a dynamic approach such as:

- parsing SCSS files
- reading component metadata
- generating UI at runtime or build time

--------------------------------------------------

# Step 5 — No Manual Maintenance

The Styleguide must require ZERO manual updates.

All updates must be:

- automatic
- consistent
- accurate

--------------------------------------------------

# Step 6 — Preserve Structure

Keep the existing structure:

Sidebar:
- Utilities
- Components

Content:
- Tables
- Examples
- Code snippets

--------------------------------------------------

# Step 7 — Validation

Ensure:

- No outdated classes are shown
- No missing components
- All examples reflect real usage
- No fake or hardcoded values

--------------------------------------------------

# Final Expected Result

- Styleguide always reflects the real project state
- Fully synchronized with utility.scss and components
- No manual effort required
- Scalable documentation system