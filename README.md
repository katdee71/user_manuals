# The Manual Shelf — Setup Guide

## First-time setup

```bash
# 1. Clone your repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Enable LFS and track PDFs
git lfs install
git lfs track "*.pdf"
git add .gitattributes
git commit -m "Track PDFs with LFS"
git push
```

Enable GitHub Pages: **Settings → Pages → Source: main / root**

---

## Adding a new manual

### 1. Scan the manual
- 300 DPI minimum (600 DPI for fine diagrams)
- Run OCR so the PDF is text-searchable
  - Free: `ocrmypdf input.pdf output.pdf`
  - Paid: Adobe Acrobat

### 2. Name and compress the file
```bash
# Naming convention: brand-model-year.pdf
# Compress with Ghostscript
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dQUIET -dBATCH \
   -sOutputFile=canon-ae1-1976.pdf input.pdf
```

### 3. Create the folder and copy in the PDF
```
manuals/
  brand-model-year/
    index.html          ← copy from manuals/canon-ae1-1976/index.html and edit
    brand-model-year.pdf
```

### 4. Add entry to manuals.json
```json
{
  "brand": "Olympus",
  "model": "OM-10",
  "year": 1979,
  "category": "camera",
  "size": "3.1 MB",
  "slug": "olympus-om10-1979",
  "description": "Owner's manual for the Olympus OM-10 ...",
  "pages": 52,
  "language": "English",
  "condition": "Very Good"
}
```

### 5. Push
```bash
git add manuals/olympus-om10-1979/ manuals.json
git commit -m "Add Olympus OM-10 (1979) manual"
git push
# GitHub Pages rebuilds automatically — live in ~30 seconds
```

---

## Categories
`camera` · `audio` · `appliance` · `electronics` · `vehicle`

To add a new category, add it to:
1. `manuals.json` entries
2. The chips in `index.html`
3. `CAT_COLORS` and `ICONS` in `assets/search.js`

---

## LFS limits (GitHub free tier)
- Storage: 1 GB
- Bandwidth: 1 GB / month
- At ~5 MB/manual ≈ 200 manuals before needing paid LFS packs ($5/mo for 50 GB)
