# fs-setlists-web

## What is it?

fs-setlists is a lib for making a React app similar to https://phishtracks.com or https://relisten.net without using a database. You can use it to browse and stream live music that is stored on a web server, cloud platform, storage bucket, etc.

The "fs" in "fs-setlists" stands for filesystem. That's because the React app is built upon metadata parsed from filename of the tracks. There are a few reasons for this:

- Your backup location (assuming you use cloud storage) can also be the location your web player sources its content from
- It encourages you to keep your local copies organized. They'll always have consistent, informative, and alphabetical (by date and then optionally track number) names

## Filename format

- `date` (required): YYYY-MM-DD
- `name` (required): name of track, hyphenated
- `trackNumber` (optional): two-digit number
- `venue` (optional): name of venue, hyphenated

Format for filename is `{date}-{trackNumber}-{name}@{venue}`

## Getters

Each storage provider has its own API for fetching the files, so a different getter function is required for each storage provider. Getters must return `Promise<FSS.Track[]>`.

Technically, getters can decide to not require the filename format, and get their data in some other way. But let's not. Storage services and our opinions about them change but my filenames won't!


## Future

- Use a React hook that provides app state to separate logic from UI
- Move data getters to separate packages
- Would it be useful to have an option for page URLs that don't look like breadcrumbs? Or the ability to copy share links like that? For sharing only one subtree
