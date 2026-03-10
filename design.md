# Markdown Share Editor Design

## Overview
- Provide a markdown editor with live preview.
- Allow users to share content with others via a short link.
- Ensure shared content is persisted for later access.

## User Flow
1. User opens the editor page.
2. User types markdown content and sees live preview.
3. User clicks the "Share" button.
4. System stores the content and returns a short share link.
5. Another user opens the link and views the rendered preview.

## Core Requirements
- Editing: markdown input with live preview.
- Sharing: click to generate a link.
- Link length: keep URLs short and stable.
- Persistence: shared content must be saved and retrievable.

## Architecture
### Frontend
- Editor page: textarea or code editor component + preview panel.
- Share button: calls backend API to save content.
- Share page: reads share ID from URL and renders content.

### Backend API
- POST /api/share
  - Request: { "content": "<markdown>" }
  - Response: { "id": "<short_id>", "url": "<share_url>" }
- GET /api/share/{id}
  - Response: { "content": "<markdown>", "createdAt": "..." }

### Storage
- Database table (example):
  - id (short string, primary key)
  - content (text)
  - created_at (timestamp)
  - updated_at (timestamp)
  - optional: expires_at (timestamp)

## Link Length Strategy
### Option A: Short ID + Server Storage (Recommended)
- Generate a short ID (8-12 chars, Base62).
- Store content on server and share via /s/{id}.
- Pros: short links, supports large content, stable.
- Cons: requires backend and storage.

### Option B: Content in URL (Not Recommended for long content)
- Encode content into URL fragment or query.
- Pros: no server storage needed.
- Cons: URL length limits and share size constraints.

## Persistence Strategy
- Use a database with indexed ID lookup.
- Optional retention policy:
  - Keep content forever by default.
  - Allow TTL/cleanup for older shares.

## Security Considerations
- Sanitize markdown rendering to prevent XSS.
- Rate limit share creation API.
- Optional: private share with access token.

## Implementation Notes
- Short ID generation: Base62 or NanoID.
- Preview rendering: use a markdown parser with sanitizer.
- Share link format: https://<domain>/s/{id}

## Deliverables
- Editor page with preview and share button.
- Share page to render stored content.
- Backend API and storage.
- Design doc (this file).
