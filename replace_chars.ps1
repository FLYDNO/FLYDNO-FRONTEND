$files = @(
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\index.html',
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\oppdag.html',
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\deals.html',
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\varsler.html',
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\historikk.html'
)

$utf8NoBom = New-Object System.Text.UTF8Encoding $False

foreach ($f in $files) {
    if (Test-Path $f) {
        $c = [System.IO.File]::ReadAllText($f)
        
        # Vowels
        $c = $c.Replace("Ã¸", "ø").Replace("Ã˜", "Ø")
        $c = $c.Replace("Ã¥", "å").Replace("Ã…", "Å")
        $c = $c.Replace("Ã¦", "æ").Replace("Ã†", "Æ")
        $c = $c.Replace("Ã¨", "è").Replace("Ã©", "é")
        $c = $c.Replace("Ã¡", "á")
        $c = $c.Replace("Â", "") # Sometimes a stray Â appears before © or spacing
        
        # Corrupted emojis that we can fix or strip
        # Emojis in DESTS that got corrupted
        $c = $c.Replace("ðŸ‡ªðŸ‡º", "🇪🇺")
        $c = $c.Replace("ðŸ‡¨ðŸ‡¿", "🇨🇿")
        $c = $c.Replace("ðŸ‡­ðŸ‡·", "🇭🇷")
        $c = $c.Replace("ðŸ‡ªðŸ‡¬", "🇪🇬")
        $c = $c.Replace("ðŸ‡²ðŸ‡»", "🇲🇻")
        $c = $c.Replace("ðŸ‡ªðŸ‡ª", "🇪🇪")
        $c = $c.Replace("ðŸ‡¨ðŸ‡´", "🇨🇴")
        $c = $c.Replace("x!x!", "")
        
        # Fix specific Oppdag route emojis corrupted
        $c = $c.Replace("ðŸ‡ªðŸ‡º", "🇪🇺")
        $c = $c.Replace("ðŸŒ", "🌍")
        $c = $c.Replace("ðŸŒŽ", "🌎")
        $c = $c.Replace("ðŸŒ", "🌏")
        $c = $c.Replace("â€¢", "•")
        $c = $c.Replace("â€“", " – ")
        $c = $c.Replace("â€”", "—")
        $c = $c.Replace("â‚¬", "€")
        $c = $c.Replace("â†’", "→")
        
        # Oppdag.html has those corrupted flag codes for the cards
        $c = $c.Replace("ðŸ‡ªðŸ‡", "🇪🇸") # ES Spain
        $c = $c.Replace("ðŸ‡¬ðŸ‡§", "🇬🇧") # GB UK
        $c = $c.Replace("ðŸ‡¹ðŸ‡", "🇹🇭") # TH Thailand
        $c = $c.Replace("ðŸ‡ºðŸ‡", "🇺🇸") # US USA
        $c = $c.Replace("ðŸ‡¯ðŸ‡", "🇯🇵") # JP Japan
        $c = $c.Replace("ðŸ‡®ðŸ‡", "🇮🇹") # IT Italy
        $c = $c.Replace("ðŸ‡¦ðŸ‡ª", "🇦🇪") # AE UAE
        $c = $c.Replace("ðŸ‡«ðŸ‡·", "🇫🇷") # FR France
        $c = $c.Replace("ðŸ‡©ðŸ‡ª", "🇩🇪") # DE Germany
        
        [System.IO.File]::WriteAllText($f, $c, $utf8NoBom)
    }
}
Write-Host "String replacement complete."
