Product Requirements Document: "Our 25 Days" Anniversary App
Project: A personalized web application serving as a 25-day countdown calendar to celebrate a 6-month anniversary.

Objective: To create a daily surprise for my girlfriend, revealing a new shared memory each day from our anniversary (July 20th) until we meet again 25 days later.

Developed By: vibe coding (AI Agent)

1. User Personas
Administrator (Me): The sole content manager for the application. My goal is to pre-load content for each of the 25 days before the anniversary date.

Recipient (My Girlfriend): The only end-user. Her goal is to visit the app daily to unlock a new memory and revisit previous ones.

2. Functional Requirements
2.1 Recipient-Facing Application
Home Screen:

Display a grid or calendar-style layout representing 25 days.

The view should be visually appealing, clean, and romantic.

Countdown Logic:

Each day in the grid is a "card" or "door."

Cards for future dates must be in a "locked" state and unclickable. The current date is determined by the server's system time.

On July 20, 2025, the card for "Day 1" becomes "unlocked." A new card unlocks each subsequent day.

Memory View:

Clicking an unlocked card opens a dedicated view for that day's memory.

This view must display the administrator-uploaded media (image, video, or audio) and the accompanying text.

The user must be able to easily navigate back to the main calendar view and select other previously unlocked days.

2.2 Administrator Panel
Authentication:

A secure, non-public route (e.g., /admin) for administrator login.

Dashboard:

Upon login, display a management interface with 25 slots, representing each day of the countdown.

Content Management:

For each day, provide a simple form with the following fields:

Title: A short title for the day (e.g., "Day 1: Where We Met").

Media Upload: A file uploader that accepts images, videos, or audio files. Files must be uploaded directly to the configured S3 bucket.

Text Content: A text area (supporting basic markdown for formatting like bold or italics would be a plus) for the daily message.

A "Save" button for each day that persists the content to the MySQL database.

3. Technical Specifications
Framework: Next.js (App Router).

Database: MySQL.

Storage: AWS S3 Bucket for all media assets. The application will store the S3 URL for each media file in the database.

Infrastructure: The entire application (Next.js app, MySQL DB) must be containerized and managed via a Docker Compose file for streamlined development and deployment.

4. Data Model (MySQL)
Create a single table named memories.

Column

Type

Notes

id

INT

Primary Key, Auto Increment

day_number

INT

Unique, 1-25

release_date

DATE

The specific date the memory unlocks (e.g., 2025-07-20)

title

VARCHAR(255)

The title for the memory

text_content

TEXT

The descriptive text/message

media_url

VARCHAR(255)

The full URL to the media file in the S3 bucket

media_type

ENUM('image', 'video', 'audio')

To help the frontend render the correct HTML tag

created_at

TIMESTAMP

Default: CURRENT_TIMESTAMP

updated_at

TIMESTAMP

Default: CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP


Export to Sheets
5. Key Dates & Timeline
Day 1 (Anniversary): July 20, 2025.

Day 25 (Meeting Day): August 13, 2025.
