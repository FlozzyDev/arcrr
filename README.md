# Arc Raiders Reports - Project Overview

## Project Summary

Arc Raiders Reports (ARCRR) is a MEAN stack web application designed to track and manage player encounters in the game Arc Raiders. The application allows users to document interactions with other players during raids, recording details about their behavior, location, and circumstances of the encounter. This is more of a proof of concept for the idea of tracking player interaction and creating a fun RP element to the game where players can record stories of the experiences they have had in game.

## Basic Stack

**Frontend:** Angular, Bootstrap 5, TypeScript, RxJS
**Backend:** Node.js, Express, ES6 Modules
**Database:** MongoDB, Mongoose

## Features

- **Reports**
  - User generated reports that allow specific raider interactions to be tracked.
  - Raiders encountered can be documented here
- **Raiders**
  - This view allows a user to view specific raiders and any associated report metrics
  - Search for raiders mid-game

---

## Application Features & User Flow

### Home Page (Root)

#### Basic Hero Section / CTA

The current home page is very basic and serves as additional points of navigation by providing the same links to Raiders and Reports that the main nav does. It does however look nice!

- **Welcome Banner** - "Welcome to Arc Raiders Reports"
- **Description / CTA** - Brief explanation of purpose and CTA to each feature.

---

### Raiders Tab (`/raiders`)

#### Purpose

Maintain a database of known players encountered across all raids, tracking their behavior patterns over time.

#### Layout

**Two-column layout:**

- **Left: Raider List** (composed of raider cards with a summary of information)
- **Right: Raider Detail** (displays more details about the specific raider when card is selected)

- **Raider Details**
  - Player name / Embark ID (you can get this at the end of game summary) / steamProfileId
  - First encounter date
  - Total encounters
  - Breakdown by disposition (friendly/skittish/unfriendly counts)
  - Picture (held locally for now, TODO is image upload and s3 storage)
  - Notes history (array of all encounters, each showing report reference, field notes, disposition, and encounter date)
  - Two action avail - **Edit** | **Delete**

#### Raider Data Structure

A raider contains:

- Name (unique)
- Embark ID (unique)
- Steam Profile ID (unique & optional for now)
- First encounter date
- Total encounters count
- Friendly encounters count
- Skittish encounters count
- Hostile encounters count
- Picture path
- Notes array (each entry represents one encounter from a report):
  - Report ID reference
  - Field notes text
  - Disposition at that encounter (friendly/skittish/unfriendly)
  - Encounter date

#### Auto generated from Reports

When a report is created, raiders are automatically:

- **Created** (if new player name) with initial encounter data
- **Updated** (if existing player):
  - Encounter counts incremented
  - New note entry added to notes array
  - Picture updated if provided
  - Embark ID added if not previously set

---

### Reports Tab (`/reports`)

#### Purpose

Track field reports from raids in Arc Raiders, documenting map conditions, time spent, and player encounters.

#### Layout

**Two-column layout:**

- **Left: Report List** (composed of report cards)
- **Right: Report Detail** (displays when card is selected)

#### Top Section

**Map Filter Dropdown**

- **Default:** "All Maps" (selected on load)
- **Dropdown options:** Populated from Maps collection
  - Each map has a unique image and title for easy selection
- **Filter:** Filters report list to show only reports from selected map

**Report Details**

- Date/time
- Report Number (Auto gen)
- Map name
- Map modifier (single selected modifier and options are based on map selected)
- Time in raid (limit varys with mod selected)
- Full list of raider encounters with: (each raider added here gets added to the Raider profile)
  - Raider name
  - Disposition (friendly/skittish/unfriendly)
  - Picture
  - Field notes for that encounter
- Two action avail - **Edit** | **Delete**

#### Report Data Structure

- Date/time (auto-generated)
- Report Number (auto-generated)
- Map ID reference
- Map modifier (single string selected from the map's mapModifiers array)
- Time in raid (max 30 minutes unless secret bunker is the mod, which it is 45)
- Raiders encounters array, each with:
  - Raider ID reference
  - Disposition (friendly/skittish/unfriendly)
  - Picture path (optional)
  - Field notes (optional)

---

### Maps Data

#### Purpose

Store available map options and their specific configurations. We just manually created this, but there are available community APIs to pull to keep data accurate.

#### Data Structure

Each map defines:

- Name
- Map modifiers array (valid modifiers for this map: none, nightRaid, lushBloom, huskGraveyard, hiddenCache, prospectingProbe, secretBunker, Harvester, Matriarch, Electromagnetic Storm)
- Banner image path

---

## Running the Application

### Mongo

Make sure Mongo is running on your local server.

### Start Backend Server

- cd into server, then run "node server.js" to run express server

Runs on `http://localhost:3000`

### Start Angular

From root, simply run "ng serve" to spin up angular

---

## Future Enhancements

Next Patch

- Date range filtering for reports
- Ability to pull the users steam profile picture
- User authentication (would require sign in to make a report)
- Deployment to Vercel/Render or something similar

Needs much more research

- Packet sniffing the ARC game (trying to determine if this breaks TOS)
  - This would allow us to pre-fill forms and make it easier for the user, as well as auto-generate steam user info.
