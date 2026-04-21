# Privacy Policy

_Last updated: April 21, 2026_

Tilth is built with the idea that your garden's memory should belong
to you. This policy explains, in plain terms, what information the
app handles, where it goes, and what you can do about it.

## The short version

- **Your garden data lives on your device.** Plant names, beds,
  photos, check-ins, diagnoses, soil readings — all stored locally
  in an encrypted SwiftData store. We never copy it to a server.
- **Some features need the internet.** Diagnoses call an AI model;
  weather comes from Apple and a weather provider; usage counts go
  to an anonymous analytics service. We only send what each feature
  strictly requires.
- **We don't collect personal information.** No names, emails,
  addresses, or phone numbers. No cross-app tracking identifiers.
  No ad networks.
- **You can delete everything by deleting the app.** There is no
  account to close, no server copy to wipe. Uninstalling Tilth
  removes every plant, photo, and diagnosis from your device.

## What data Tilth handles

### On your device only

These stay on your iPhone in Tilth's private storage and are never
sent anywhere:

- Your garden's name, bed names and properties, plant names and varieties
- Photos you take for check-ins or diagnoses
- Check-in notes, actions, and weather snapshots
- Soil composition, pH readings, amendment log
- Diagnosis records (your concern, the AI's response, your rating)
- Transplant events

### Sent to third-party services when you use a feature

Certain features require a network call. When you invoke them,
Tilth sends only what that feature needs, nothing else:

- **AI diagnosis** (when you tap "Why isn't this growing?")
  - What we send: the plant's profile, its bed's soil and light
    conditions, recent weather history for your location, your
    typed concern, and an optional photo you attached.
  - Sent via our own Cloudflare Worker proxy, which forwards to
    Anthropic's Claude API.
  - Anthropic's privacy practices:
    <https://www.anthropic.com/privacy>

- **Weather** (Weather tab, diagnosis context)
  - What we send: your garden's latitude and longitude.
  - Current conditions and forecast come from Apple's WeatherKit.
  - Historical weather (past 14 days) comes from Visual Crossing,
    also via our Cloudflare Worker proxy.
  - Apple WeatherKit:
    <https://developer.apple.com/weatherkit/data-source-attribution/>
  - Visual Crossing privacy: <https://www.visualcrossing.com/privacy>

- **USDA hardiness zone detection** (when you grant location)
  - What we send: your garden's latitude and longitude.
  - Sent to the Claude API via our proxy to translate coordinates
    into a USDA zone. If you decline location, you can pick a zone
    manually in onboarding — no coordinates are sent in that case.

- **Plant profiles** (the "ideal conditions" shown when you add a
  plant)
  - What we send: the plant's common name you typed in.
  - Sent to the Claude API via our proxy. The returned profile is
    cached on your device so the same plant isn't re-queried.

- **In-app feedback** (Settings → Send feedback)
  - What we send: the category you picked, your free-text message,
    your app version and device model (iPhone model, iOS version).
    No names, no emails.
  - Sent to a private Telegram chat where we read beta feedback,
    via our Cloudflare Worker proxy.

- **Anonymous usage analytics** (always on)
  - What we send: counts of feature usage (a bed was created, a
    diagnosis was submitted, the paywall was shown). Events include
    your app version, iOS version, and device model. No content
    from your garden — we don't know what plants you grow or what
    you asked the AI.
  - Sent to TelemetryDeck, a privacy-focused analytics service.
  - User identification uses an anonymous hashed identifier that
    cannot be traced back to you.
  - TelemetryDeck privacy: <https://telemetrydeck.com/privacy>

### Our Cloudflare Worker proxy

Every network call to an AI or weather service routes through a
Cloudflare Worker we run. The proxy:

- Holds the actual API keys server-side so they don't ship on your
  device.
- Rate-limits per-device by an anonymous UUID stored in your
  Keychain (no personal link to you).
- Logs the HTTP method, path, and response status for operational
  monitoring.
- Does not log request bodies, response bodies, or identifying
  information about you.

## Data we do NOT collect

- Your name, email, phone number, or address.
- Your contacts, calendar, reminders, or other on-device data
  outside Tilth's own storage.
- Your Apple ID or Game Center information.
- Advertising identifiers (IDFA). Tilth does not use App Tracking
  Transparency because it does not track you across apps or
  websites.

## Permissions we request

- **Location (while using the app)** — so Weather and USDA zone
  detection work. You can decline and set your zone manually; the
  Weather tab will explain what's affected.
- **Camera** — so you can photograph plants during check-ins and
  diagnoses.
- **Photo library** — so you can attach existing photos to
  check-ins and diagnoses.

Each permission is optional. Declining one disables the feature
that depends on it and nothing else.

## Your rights and choices

- **Delete all data.** Uninstalling Tilth removes every plant,
  photo, diagnosis, and preference from your device. There is no
  server copy.
- **Revoke permissions.** Toggle location, camera, or photo access
  in iOS Settings → Tilth at any time. The app adapts gracefully.
- **Export your data.** A future version of Tilth will let you
  export your garden as a portable archive (Markdown + photos).
  This is a planned feature; the placeholder in Settings currently
  reads "Coming soon."
- **Opt out of analytics.** Analytics is on by default during the
  beta. A future version will add a toggle to opt out.

## Children

Tilth is not directed at children under 13. We do not knowingly
collect information from children. If you believe a child has used
the app and sent information, contact us and we will help identify
anything to delete.

## Security

- Tilth's on-device storage uses Apple's default data protection,
  which encrypts at rest when the device is locked.
- Network calls use HTTPS end to end, including to our own Worker
  proxy.
- The Keychain UUID used for proxy rate limiting is stored in the
  iOS Keychain with default device-bound protection and never
  leaves your device except as a request header.

## Changes to this policy

We may update this policy as Tilth adds features or changes which
services it uses. Material changes will be announced in the app's
release notes. The "Last updated" date at the top of this page
reflects the most recent revision.

## Contact

Questions, concerns, or data-deletion requests:
[mikespearman.e@gmail.com](mailto:mikespearman.e@gmail.com)
