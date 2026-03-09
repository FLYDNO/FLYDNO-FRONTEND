$files = @(
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\varsler.html',
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\historikk.html',
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\oppdag.html',
    'c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\index.html'
)
$utf8NoBom = New-Object System.Text.UTF8Encoding $False

foreach ($f in $files) {
    if (Test-Path $f) {
        $c = [System.IO.File]::ReadAllText($f)
        $c = $c -replace "`r`r`n", "`r`n"
        
        if ($f -match 'varsler|historikk') {
            $c = $c -replace "fra 🇳🇴 Oslo", "fra Oslo"
            $c = $c -replace "fra 🇳🇴 Bergen", "fra Bergen"
        }
        if ($f -match 'oppdag') {
            $c = $c -replace "🇪🇺 Europa", "🌍 Europa"
            $c = $c -replace "🇳🇴 Oslo → 🇪🇸 Alicante", "Oslo → Alicante"
            $c = $c -replace "🇳🇴 Bergen → 🇮🇹 Roma", "Bergen → Roma"
            $c = $c -replace "🇳🇴 Oslo → 🇬🇷 Chania", "Oslo → Chania"
        }
        if ($f -match 'index') {
            # Restore base64
            $ep = [System.IO.File]::ReadAllText('c:\Users\Bruker\Desktop\FLYDNO-FRONTEND\FLYDNO-FRONTEND-main\FLYDNO-FRONTEND-main\earth-preview.html')
            if ($ep -match 'src="(data:image/jpeg;base64[^"]+)"') {
                $b64 = $matches[1]
                $c = $c -replace "url\('iStock-1370838389.jpg'\)", "url('$b64')"
            }
            # Remove the mask-image
            $c = $c -replace " -webkit-mask-image: linear-gradient\(to bottom, transparent, black 15%, black 85%, transparent\); mask-image: linear-gradient\(to bottom, transparent, black 15%, black 85%, transparent\);", ""
        }

        [System.IO.File]::WriteAllText($f, $c, $utf8NoBom)
    }
}
Write-Host "Revert script completed"
