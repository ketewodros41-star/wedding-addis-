# Wedding Addis — Advanced Invitation Builder System Prompt

## Project Context

You are building an advanced luxury wedding invitation system for Wedding Addis, a premium Ethiopian wedding planning platform built with:

* Next.js App Router
* TypeScript
* TailwindCSS
* Framer Motion
* Supabase
* Supabase Storage

The current invitation system is basic.

Your task is to transform it into a highly creative, modern, emotionally immersive invitation studio that feels premium, cinematic, and customizable.

The experience should feel closer to:

* Canva
* Apple invitation design
* luxury wedding websites
* modern editorial design tools

NOT:

* a simple CRUD form
* generic templates
* static cards

---

# CORE PRODUCT VISION

The invitation builder should feel like:

“designing a luxury digital wedding experience.”

Users should:

* customize deeply
* upload/edit images
* personalize animations
* generate beautiful shareable pages
* create invitations that feel emotional and premium

The system must support:

* Ethiopian wedding aesthetics
* modern luxury styles
* traditional Habesha styles
* cinematic storytelling

---

# PRIMARY FEATURES TO IMPLEMENT

1. Large Template Marketplace
2. Fully Editable Invitation Studio
3. Advanced Image Editing
4. Interactive Public Invitation Pages
5. Motion & Animation System
6. RSVP System
7. Creative Sharing Features
8. Mobile-First Story Experience
9. Invitation Personalization Engine
10. Export & Save System

---

# FEATURE 1 — TEMPLATE MARKETPLACE

## Goal

Users should browse many professionally designed invitation templates.

---

## Template Categories

Implement categories:

### Luxury

* black & gold
* editorial serif
* modern minimalist
* monochrome elegance

### Ethiopian Traditional

* Habesha patterns
* traditional gold borders
* cultural motifs
* Orthodox-inspired elegance

### Garden & Floral

* botanical
* romantic floral
* spring aesthetic
* soft pastel themes

### Cinematic

* fullscreen photo storytelling
* film-style transitions
* dramatic typography

### Modern Interactive

* scrolling storytelling
* animated layouts
* layered parallax sections

### Minimal

* typography-focused
* whitespace-heavy
* clean luxury

---

## Template Browser

Build:

* searchable template gallery
* filtering by style
* hover previews
* animated preview cards
* mobile-friendly carousel
* “Use Template” flow

---

## Template Data Structure

Create:

### invitation_templates

Fields:

* id
* title
* slug
* category
* preview_image
* configuration_json
* premium_style_tags
* created_at

---

# FEATURE 2 — FULL INVITATION STUDIO

## Goal

Create a real design studio experience.

---

## Editable Elements

Users must be able to edit:

### Text

* couple names
* event title
* date/time
* venue
* custom message
* RSVP details
* hashtags

### Typography

* font family
* font size
* font weight
* spacing
* alignment
* colors

### Layout

* reposition elements
* resize sections
* toggle sections on/off

### Decorations

* borders
* overlays
* floral frames
* gradients
* textures
* ornaments

---

## UX REQUIREMENTS

Implement:

* live real-time preview
* instant visual updates
* side editing panel
* draggable editing controls
* mobile responsive editing

The editor should feel smooth and premium.

---

# FEATURE 3 — ADVANCED IMAGE EDITING

## Goal

Allow users to create beautiful cinematic visuals.

---

## Upload System

Use Supabase Storage.

Allow:

* multiple image uploads
* drag & drop uploads
* mobile uploads
* cover image selection

---

## Image Editing Features

Implement:

### Cropping

* free crop
* portrait crop
* landscape crop
* story crop

### Filters

* warm luxury
* cinematic
* vintage
* monochrome
* romantic glow
* soft pastel

### Effects

* blur background
* vignette
* grain
* brightness
* contrast
* saturation

### Positioning

* zoom
* pan
* rotate

### Creative Features

* layered photo collages
* photo masking
* split layouts
* framed portraits
* transparent overlays

---

## AI-Like Creative UX

Add:

* automatic focal centering
* smart crop suggestions
* “best fit” preview modes

---

# FEATURE 4 — PUBLIC INVITATION EXPERIENCE

## Goal

The public invite page should feel magical.

---

## Dynamic Route

Create:

```bash id="t5mjlwm"
/invite/[slug]
```

---

## Public Invitation Features

Display:

* cinematic hero section
* animated entrance
* countdown timer
* couple story
* event timeline
* map section
* RSVP form
* gallery
* music player
* dress code
* family section

---

## Optional Sections

Allow users to toggle:

* engagement story
* family introductions
* wedding itinerary
* gift registry
* hotel/accommodation info
* transportation details

---

# FEATURE 5 — ANIMATION SYSTEM

## Goal

Make invitations feel alive.

---

## Motion Features

Use Framer Motion.

Implement:

* fade reveals
* cinematic transitions
* floating elements
* scroll-triggered animations
* parallax image movement
* smooth section transitions

---

## Advanced Effects

Add:

* animated floral particles
* subtle sparkle effects
* slow zoom hero images
* ambient moving gradients

Animations should remain elegant and not overwhelming.

---

# FEATURE 6 — RSVP SYSTEM

## Goal

Turn invitations into interactive event hubs.

---

## RSVP Features

Guests can:

* confirm attendance
* decline
* add plus-one
* specify meal preference
* leave messages

---

## RSVP Dashboard

Users can see:

* total attendees
* pending responses
* guest messages
* attendance analytics

---

## Database

### invitation_rsvps

Fields:

* id
* invitation_id
* guest_name
* attending
* plus_one
* meal_preference
* message
* submitted_at

---

# FEATURE 7 — MUSIC & ATMOSPHERE

## Goal

Create emotional immersion.

---

## Music Features

Allow:

* Spotify links
* YouTube music embeds
* autoplay optional
* custom wedding soundtrack

---

## Atmosphere Modes

Templates can include:

* romantic ambience
* traditional Ethiopian music vibe
* cinematic orchestral mood

---

# FEATURE 8 — MOBILE STORY MODE

## Goal

Optimize invitations for mobile sharing.

---

## Story Experience

Implement:

* fullscreen vertical invitation mode
* swipeable invitation sections
* Instagram-story-inspired transitions
* tap navigation

Perfect for WhatsApp sharing.

---

# FEATURE 9 — CREATIVE SHARING

## Goal

Encourage viral/social sharing.

---

## Sharing Features

Implement:

* WhatsApp sharing
* Telegram sharing
* Instagram story export
* downloadable image export
* QR code generation
* short invitation links

---

## Export Formats

Generate:

* PNG
* mobile story image
* printable PDF
* square social preview

---

# FEATURE 10 — INVITATION PERSONALIZATION ENGINE

## Goal

Make invitations feel unique.

---

## Smart Theme Suggestions

Recommend themes based on:

* saved inspiration
* wedding style
* colors
* venue type
* Ethiopian traditional preferences

---

## Smart Color Extraction

Extract colors automatically from uploaded photos.

Generate:

* matching palettes
* typography colors
* overlay tones

---

# FEATURE 11 — MULTI-EVENT SUPPORT

## Goal

Support full wedding event sequences.

---

## Event Types

Allow multiple connected events:

* engagement
* bridal shower
* mehfil
* ceremony
* reception
* after party

Each event can have:

* unique date
* venue
* section
* RSVP logic

---

# FEATURE 12 — ADMIN TEMPLATE SYSTEM

## Goal

Allow scalable template management.

---

## Admin Features

Admins can:

* upload new templates
* manage categories
* feature premium templates
* moderate public galleries

---

# FEATURE 13 — DATABASE STRUCTURE

Create:

### invitations

### invitation_templates

### invitation_images

### invitation_rsvps

### invitation_events

### invitation_music

### invitation_theme_settings

Use:

* foreign keys
* indexes
* timestamps
* row-level security

---

# FEATURE 14 — PERFORMANCE REQUIREMENTS

Optimize:

* image loading
* lazy rendering
* animation performance
* mobile responsiveness

Use:

* image compression
* blurred placeholders
* dynamic imports
* memoization

---

# FEATURE 15 — ACCESSIBILITY

Support:

* keyboard navigation
* reduced motion mode
* readable typography
* mobile screen readers

---

# FEATURE 16 — ETHIOPIAN CULTURAL EXPERIENCE

Deeply integrate:

* Habesha aesthetics
* Ethiopian gold palettes
* traditional typography inspiration
* cultural patterns
* Orthodox-inspired luxury visuals

Do NOT make the templates feel western-only.

The app should feel:
“globally modern but culturally Ethiopian.”

---

# FINAL EXPECTATION

The invitation system should feel like:

“a premium cinematic wedding storytelling platform.”

Users should feel proud sharing their invitation links.

The final experience should:

* feel emotional
* feel luxurious
* feel memorable
* feel immersive
* feel modern
* feel creative
* feel culturally rich

NOT:

* a simple invitation form
* a static template generator
* a generic event page
