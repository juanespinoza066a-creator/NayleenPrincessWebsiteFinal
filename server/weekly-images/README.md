# Weekly note photos

Upload one JPEG, PNG, or WebP per note to this folder. Use a filename such as `week-02.webp`.

In `server/weekly-notes.json`, find the entry for that week and add the filename
in an optional `image` field. Leave out the field for notes without photos.

```json
{
  "week": 2,
  "emoji": "💜",
  "title": "Our second week",
  "message": "Write your message here.",
  "published": true,
  "image": "week-02.webp",
  "imageAlt": "Describe what the photo shows."
}
```

Keep this repository private so only authorized collaborators can see drafts
on GitHub. The site serves notes and their photos after sign-in, once the
week has arrived and the note is published.
