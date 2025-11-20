# Language images

We only take images that are public domain.

## From [Open Clipart](https://openclipart.org/)

**License**: [Creative Commons Zero 1.0 Public Domain](https://openclipart.org/share "Creative Commons Zero 1.0 Public Domain")

- de.svg: <https://openclipart.org/detail/296539/german-flag>
- ca.svg: <https://openclipart.org/detail/257351/flag-of-catalonia>
- en.svg: <https://openclipart.org/detail/326131/flag-uk>
- eo.svg: <https://openclipart.org/detail/91837/esperanta-flago>
- fi.svg: <https://openclipart.org/detail/17744/flag-of-finland>
- fr.svg: <https://openclipart.org/detail/246307/flag-of-france>
- es.svg: <https://openclipart.org/detail/17279/flag-of-spain>
- it.svg: <https://openclipart.org/detail/246302/flag-of-italy>
- ko.svg: <https://openclipart.org/detail/8034/south-korean-flag>
- ru.svg: <https://openclipart.org/detail/258414/Flag-of-Russia>

All images are edited with the following steps:

- changed size to 24x16 px (Inkscape)
  - it's important that the svg files contain: width="24" height="16"
- size optimized with [SVGOMG](https://jakearchibald.github.io/svgomg/)
- removed manually unnecessary IDs (with text editor)

## Translation symbol

**License**: [Creative Commons Zero 1.0 Public Domain](https://openclipart.org/share "Creative Commons Zero 1.0 Public Domain")

Self created with chinese letter 文 and latin letter A.

## Adding new language flags

If you want to add a new language flag to the built-in flags CSS:

1. **Find a public domain SVG**:
   - Use [OpenClipart](https://openclipart.org/) or similar CC0/Public Domain source
   - Ensure the license is compatible (CC0-1.0 or Public Domain)

2. **Edit the SVG**:
   - Resize to exactly 24×16 pixels using Inkscape
   - Ensure the SVG file contains `width="24" height="16"` attributes
   - Optimize with [SVGOMG](https://jakearchibald.github.io/svgomg/)
   - Manually remove unnecessary IDs with a text editor

3. **Convert to Base64**:

   ```bash
   base64 -w 0 images/xx.svg
   ```

4. **Add to `src/leaflet.languageselector-flags.css`**:
   - Add CSS custom property in `:root` section:
     ```css
     --languageselector-flag-xx: url("data:image/svg+xml;base64,YOUR_BASE64_HERE");
     ```
   - Add `::before` pseudo-element rule:
     ```css
     [data-lang="xx"]::before {
       background-image: var(--languageselector-flag-xx);
     }
     ```

5. **Test**:
   - Import the flags CSS in your project
   - Use `langObject("xx", "Language Name")` without icon parameter
   - The flag should appear automatically via CSS

6. **Submit a Pull Request**:
   - Add the SVG file to `images/` directory
   - Update this file with the source URL and license
   - Update `src/leaflet.languageselector-flags.css`
