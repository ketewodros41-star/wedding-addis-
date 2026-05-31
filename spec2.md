# Wedding Addis — Full MVP Expansion Prompt

## Project Context

You are working on **Wedding Addis**, a modern Ethiopian wedding planning platform built with:

* Next.js App Router
* TypeScript
* TailwindCSS
* Supabase Auth
* Supabase Database
* Supabase Storage

The project already contains:

* authentication
* dashboard
* inspiration boards
* booking wizard
* invitations builder
* venues browsing
* planner UI
* exploration/discovery pages

The app currently exists in a polished MVP/prototype stage.

Your task is to evolve the platform into a much more complete and production-ready wedding planning application while preserving the existing elegant luxury aesthetic.

The application focuses specifically on:

* Addis Ababa weddings
* Ethiopian wedding culture
* premium modern wedding planning
* inspiration-driven discovery

---

# IMPORTANT PRODUCT DIRECTION

DO NOT implement payments yet.

Instead of paid checkout:

* users should be able to send/share their inspiration board directly
* users can submit booking requests
* vendors/admins can later review requests manually

The platform should feel operational without requiring online payments.

---

# PRIMARY GOALS

Implement the following major systems:

1. Complete Booking System
2. Real Planner System
3. Public Invitation Pages + RSVP
4. Guest Management
5. Vendor Marketplace Structure
6. Real Search + Filtering
7. Notifications Infrastructure
8. Media Upload Infrastructure
9. Better Dashboard Personalization
10. Admin Foundation

The codebase must remain:

* modular
* scalable
* responsive
* production-oriented
* visually premium

---

# DESIGN REQUIREMENTS

Maintain:

* elegant luxury wedding aesthetic
* editorial modern UI
* soft premium gradients
* clean typography
* immersive imagery
* smooth transitions
* mobile-first responsive layouts

Avoid:

* generic admin-looking UI
* cluttered layouts
* cheap card-heavy dashboards
* excessive colors

Visual inspiration:

* luxury wedding brands
* Pinterest
* Apple-level spacing
* modern editorial design

---

# IMPLEMENTATION REQUIREMENTS

Use:

* TypeScript everywhere
* reusable server utilities
* proper loading states
* empty states
* optimistic UX where appropriate
* skeleton loaders
* toast notifications
* error boundaries

Use:

* React Hook Form
* Zod validation
* Supabase Row Level Security
* reusable UI primitives

---

# FEATURE 1 — COMPLETE BOOKING SYSTEM

## Goal

Transform bookings from a single insert action into a real workflow.

---

## Booking Wizard

Expand all wizard steps into real forms.

### Step 1 — Couple Identity

Collect:

* bride name
* groom name
* email
* phone number
* wedding date
* guest estimate

### Step 2 — Wedding Details

Collect:

* wedding type
* ceremony type
* indoor/outdoor preference
* preferred area in Addis
* cultural/traditional preferences

### Step 3 — Mood & Vision

Collect:

* preferred styles
* color palettes
* inspiration selections
* notes
* linked inspiration board items

### Step 4 — Planning

Collect:

* budget range
* desired venue
* catering preference
* photography preference
* planner support needed

---

## Booking Features

Implement:

* edit booking
* cancel booking
* booking details page
* booking timeline
* booking status badges

Statuses:

* pending
* reviewing
* confirmed
* completed
* cancelled

---

## Database

Create proper relational structures.

### bookings

Fields:

* id
* user_id
* bride_name
* groom_name
* wedding_date
* guest_count
* budget_range
* status
* created_at

### booking_notes

### booking_vendors

### booking_timeline

---

# FEATURE 2 — REAL PLANNER SYSTEM

## Goal

Convert planner from static UI into persistent wedding management.

---

## Planner Features

Implement:

* editable checklist
* progress tracking
* task completion
* due dates
* timeline management

### Example Tasks

* Book venue
* Hire photographer
* Confirm catering
* Order cake
* Send invitations

---

## Planner Persistence

Create:

### planner_tasks

Fields:

* id
* booking_id
* title
* completed
* due_date
* category

---

## Planner UX

Add:

* progress bars
* overdue task highlighting
* upcoming milestone section
* wedding countdown

---

# FEATURE 3 — PUBLIC INVITATION SYSTEM

## Goal

Generate real shareable invitation pages.

---

## Dynamic Route

Create:

```bash
/invite/[slug]
```

---

## Public Invitation Page Features

Display:

* couple names
* date
* time
* venue
* hero image
* wedding message
* countdown timer
* map section
* RSVP form

---

## RSVP System

Create:

### rsvps

Fields:

* id
* invitation_id
* guest_name
* attending
* guest_count
* dietary_notes

---

## Invitation Builder Improvements

Allow:

* custom cover image upload
* multiple invitation themes
* typography customization
* editable message section

---

# FEATURE 4 — GUEST MANAGEMENT

## Goal

Allow users to manage wedding guests.

---

## Features

Implement:

* guest list CRUD
* RSVP tracking
* plus-one support
* seating categories
* dietary restrictions

---

## Database

### guests

Fields:

* id
* booking_id
* full_name
* phone
* email
* invited
* attending
* table_assignment

---

# FEATURE 5 — VENDOR MARKETPLACE FOUNDATION

## Goal

Create a scalable vendor architecture.

---

## Vendor Categories

Implement:

* venues
* photographers
* decorators
* florists
* makeup artists
* caterers
* DJs
* MCs

---

## Vendor Features

Create:

* vendor profile pages
* gallery sections
* availability status
* reviews
* pricing ranges
* contact request button

---

## Database

### vendors

### vendor_images

### vendor_reviews

### vendor_categories

---

# FEATURE 6 — REAL SEARCH & FILTERING

## Goal

Connect filters to real query logic.

---

## Explore Page

Implement:

* server-backed filtering
* search by keyword
* sorting
* pagination

---

## Filters

Support:

* budget
* location
* rating
* style
* capacity
* category

---

## Technical Requirements

Use:

* URL search params
* debounced search
* reusable filter hooks

---

# FEATURE 7 — INSPIRATION BOARD SHARING

## IMPORTANT

This replaces payments for now.

---

## Goal

Allow users to send/share their inspiration board directly.

---

## Features

Implement:

* shareable inspiration links
* WhatsApp sharing
* email sharing
* downloadable PDF moodboard
* “Send to Planner” button

---

## Send To Planner Flow

Users can:

* send their inspiration board
* include notes
* include wedding date
* include budget range

Store requests in:

### inspiration_requests

---

# FEATURE 8 — MEDIA UPLOAD INFRASTRUCTURE

## Goal

Replace placeholder URLs with real uploads.

---

## Use Supabase Storage

Implement uploads for:

* invitation images
* profile photos
* inspiration uploads
* vendor galleries

---

## Requirements

Add:

* drag-and-drop upload
* image preview
* compression
* upload progress indicators

---

# FEATURE 9 — SMART DASHBOARD

## Goal

Make dashboard feel alive and personalized.

---

## Dashboard Sections

Add:

* wedding countdown
* upcoming tasks
* latest inspiration
* recent bookings
* planner completion
* RSVP summary
* vendor recommendations

---

## Smart Suggestions

Generate recommendations based on:

* saved inspiration
* wedding budget
* selected style
* guest count

---

# FEATURE 10 — ADMIN FOUNDATION

## Goal

Create operational scalability.

---

## Admin Features

Implement:

* manage venues
* manage vendors
* moderate uploads
* review inspiration requests
* manage bookings
* analytics overview

---

## Admin Protection

Use:

* role-based access
* protected admin routes

---

# DATABASE REQUIREMENTS

Implement:

* foreign keys
* cascading deletes where appropriate
* indexes for search-heavy tables
* timestamps on all entities
* row-level security policies

---

# AUTH REQUIREMENTS

Protect:

* dashboard routes
* planner routes
* invitation editing
* booking editing
* admin routes

Redirect unauthenticated users appropriately.

---

# PERFORMANCE REQUIREMENTS

Implement:

* image lazy loading
* route loading states
* optimized queries
* pagination
* server-side fetching where appropriate

---

# MOBILE REQUIREMENTS

Ensure:

* perfect mobile responsiveness
* touch-friendly interactions
* sticky bottom navigation
* smooth scrolling
* optimized modal behavior

---

# ACCESSIBILITY REQUIREMENTS

Implement:

* keyboard navigation
* focus states
* semantic HTML
* aria labels
* proper contrast

---

# ETHIOPIAN LOCALIZATION

Integrate:

* Ethiopian wedding traditions
* Addis-specific venues
* Habesha aesthetics
* optional Amharic labels
* culturally relevant wedding flows

Do NOT make the app feel westernized-only.

---

# FINAL EXPECTATION

The final platform should feel like:

“a premium Ethiopian wedding planning ecosystem”

NOT:

* a template
* a dashboard clone
* a generic CRUD app

The experience should feel:

* emotional
* aspirational
* luxurious
* organized
* culturally grounded
* modern