# Wedding Addis App State

## Overview
Wedding Addis is a wedding planning and inspiration app focused on Ethiopian/ Addis Ababa celebrations. The current codebase is a Next.js app with a shared header/footer, a styled marketing home page, and several route pages for planning, browsing, and saving wedding ideas.

## Shared App Structure
- Global metadata is set in `app/layout.tsx`.
- The app uses Google fonts (`Noto Serif` and `Manrope`) plus the Material Symbols icon font.
- The shared layout keeps the page background, text color, and font variables consistent across routes.
- The top navigation is implemented in `components/layout/Header.tsx`.
- The footer is implemented in `components/layout/Footer.tsx` and includes desktop quick links plus a mobile bottom nav.
- Supabase is the backend client used for auth and data persistence in several routes.

## Main Routes

### `/` Home
The home page composes the main marketing sections:
- Hero banner with a large cover image, primary call to action, and inspiration link.
- Stories section that opens a full-screen story viewer with progress indicators and tap zones for previous/next.
- Featured venues carousel-style section with horizontally scrollable venue cards.
- Booking preview section with date and area inputs plus a check availability button.
- Aesthetic styles section showing traditional, modern, and garden-style wedding directions.
- Testimonials section with wedding couple quotes.
- Shared header and footer wrap the page.

Current state:
- Mostly promotional and navigational.
- Buttons primarily route the user to other pages.
- The story viewer is interactive on the client side.

### `/login`
Authentication page.

Current functionality:
- Toggle between login and sign-up modes.
- Email/password sign-in with Supabase auth.
- Email/password sign-up with Supabase auth.
- Google OAuth sign-in.
- Displays auth errors.
- Redirects to `/dashboard` after successful login.

Notes:
- The forgot password link is only a placeholder.
- The page is fully client-side.

### `/booking`
Booking wizard for starting a wedding plan.

Current functionality:
- Multi-step wizard UI with four labeled stages: Identity, Details, Mood, and Vision.
- Final step lets the user choose a theme, budget level, and venue.
- The submit action writes a booking to Supabase `bookings`.
- Requires an authenticated user; otherwise it redirects to `/login`.
- On success it alerts the user and redirects to `/dashboard`.

Current state:
- Steps 1 to 3 are mostly scaffolding and advance the wizard without collecting real form data.
- Step 4 contains the actual editable controls and backend submit logic.

### `/dashboard`
Authenticated user dashboard.

Current functionality:
- Fetches the current Supabase user.
- Loads profile data from `profiles`.
- Loads the user’s bookings from `bookings`.
- Loads the user’s inspiration board from `inspiration_boards`.
- Shows a planning progress indicator.
- Shows a preview of saved inspiration items.
- Shows upcoming bookings with status labels.
- Includes a shortcut to the invitations builder.

Current state:
- Redirects unauthenticated users to `/login`.
- Mostly a data overview and navigation hub.

### `/explore`
Exploration and discovery page.

Current functionality:
- Category browsing for venues, cakes, decor, catering, couture, flowers, attire, and floral ideas.
- Search box filters items by name.
- User favorites are stored in browser `localStorage` keyed by Supabase user ID.
- Cards can be marked as favorite and the state persists locally for that user.
- Selecting a category collapses the initial search/cards layout into a filtered results view.
- Contains a filter sidebar with budget, style, and rating UI controls.

Current state:
- Category selection and search work.
- The filter sidebar controls are mostly presentational and do not filter results yet.
- The grid is driven by a small static in-memory dataset.

### `/inspiration`
Vision board and inspiration gallery.

Current functionality:
- Shows a curated gallery of inspiration items.
- Category filters: All, Favourites, Venue, Cakes, Decor, Style, Catering.
- Clicking a gallery item saves it to the user’s inspiration board in Supabase.
- Removes items from the board from the sidebar list.
- Loads favorites from the same localStorage storage used by `/explore`.
- Sharing options for WhatsApp and email include the saved board contents.

Backend behavior:
- If the user has no board yet, one is created in `inspiration_boards`.
- Saved items are stored as JSON in the board record.

Current state:
- The gallery is a mix of static curated items and saved board state.
- Sharing only works when the user is authenticated and has saved items.

### `/invitations`
Invitation builder.

Current functionality:
- Lets the user choose between minimalist and floral invitation templates.
- Editable fields for couple names, date, time, venue, and featured photo URL.
- Live preview card showing the invitation layout.
- QR code generated from a shareable invitation preview URL.
- Saves invitation data to Supabase `invitations`.
- Share actions for WhatsApp and email.

Current state:
- The preview is live and updates as the fields change.
- Save action is backend-connected.
- The QR code currently points to a generated preview-style URL rather than a fully implemented public invite route.

### `/planner`
Planning and budgeting page.

Current functionality:
- Budget estimator with sliders for venue, catering, decor, and photography.
- Total estimated budget updates live.
- Compares the estimate to an average local wedding cost.
- Timeline planner shows staged wedding milestones.
- Marketing-style closing section with a call to action.

Current state:
- Strongly interactive on the client side.
- No backend persistence yet.
- The timeline is illustrative, not an editable planner.

### `/venues`
Venue discovery page.

Current functionality:
- Fetches venue records from Supabase `venues`.
- Falls back to a static set of venue cards if no data is returned.
- Card grid shows venue name, location, capacity, and a fixed rating display.
- Clicking a venue opens a detail panel on the map-style preview area.
- Includes zoom-style controls and selected venue summary UI.
- The lower part of the page includes curated collection cards.

Current state:
- Venue listing is data-backed when Supabase returns rows.
- Some controls are presentational only, including filter/sort buttons and map controls.

### `/cakes`
Cake gallery page.

Current functionality:
- Large editorial hero section for wedding cakes.
- Featured cake card and several category cards.
- Clickable cards route to `/booking`.
- Focuses on modern luxe and traditional Ethiopian cake styles.

Current state:
- Mostly a visual browsing page.
- Booking is the main interaction.

## Shared Home Components

### `components/home/Hero.tsx`
- Main landing hero image and headline.
- Links to booking and inspiration.
- Scroll indicator animation.

### `components/home/FeaturedVenues.tsx`
- Horizontal featured venue cards.
- Static content only.

### `components/home/BookingPreview.tsx`
- Lightweight availability form with date and area inputs.
- Check availability button is presentational.

### `components/home/Styles.tsx`
- Three aesthetic style cards.
- Purely promotional and visual.

### `components/home/Testimonials.tsx`
- Customer testimonial cards.
- Static social proof section.

### `components/home/WeddingStories.tsx`
- Story avatar row.
- Full-screen story viewer with next/previous interactions and timed progress.
- Client-side only; no backend data.

## Backend / Data Model Usage
The app currently relies on these Supabase tables or auth features:
- `auth` for login, signup, and current user lookup.
- `profiles` for dashboard profile display.
- `bookings` for booking creation and dashboard booking history.
- `inspiration_boards` for saved inspiration items.
- `invitations` for invitation drafts.
- `venues` for venue browsing.

## What Works Now
- User authentication with email/password and Google OAuth.
- Booking submission to Supabase.
- Dashboard data loading for authenticated users.
- Inspiration board persistence.
- Invitation draft saving.
- Venue data loading with fallback content.
- Client-side browsing and selection flows across multiple pages.
- LocalStorage-backed favorites in Explore.

## What Is Still Partial Or Placeholder
- Footer quick links point to routes that do not exist yet: `/about`, `/terms`, `/privacy`, and `/contact`.
- The booking wizard collects real data only at the final step; earlier steps are mostly guided UI.
- Explore sidebar filters are not connected to the results grid yet.
- Planner timeline is informational, not an editable project planner.
- Venue map controls are decorative.
- Some pages use hard-coded sample content instead of live backend data.

## Overall State
The app is in a polished prototype stage. The navigation, discovery flows, and several Supabase-backed save/login features are already functional, but parts of the experience are still presentation-first scaffolding rather than fully implemented business logic.
