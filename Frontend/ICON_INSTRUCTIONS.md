# PWA Icon Generation Instructions

## Quick Method: Use Online Converter

1. Open the SVG files (logo192.svg and logo512.svg) in your browser
2. Take screenshots or use an online SVG to PNG converter:
   - https://cloudconvert.com/svg-to-png
   - https://svgtopng.com/
   - https://www.photopea.com/ (online Photoshop alternative)

3. Convert:
   - logo192.svg → logo192.png (192x192)
   - logo512.svg → logo512.png (512x512)

4. Place the PNG files in the `public` folder

## Alternative: Use Professional Tool

### Using Photopea (Free, Online)
1. Go to https://www.photopea.com/
2. File → Open → Select logo192.svg
3. File → Export As → PNG
4. Set size to 192x192
5. Save as logo192.png
6. Repeat for logo512.svg (512x512)

### Using GIMP (Free, Desktop)
1. Open GIMP
2. File → Open → Select SVG file
3. Set size when prompted (192 or 512)
4. File → Export As → PNG
5. Save in public folder

### Using ImageMagick (Command Line)
```powershell
# If you have ImageMagick installed
magick logo192.svg -resize 192x192 logo192.png
magick logo512.svg -resize 512x512 logo512.png
```

## Already Have a Logo?

If you have your own logo image:
1. Resize to 192x192 and 512x512
2. Name them logo192.png and logo512.png
3. Place in the `public` folder
4. Delete the SVG files

## Note

The SVG files work as placeholders, but PNG/WebP formats are better supported across all devices.
