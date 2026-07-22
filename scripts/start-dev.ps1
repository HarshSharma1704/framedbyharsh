$env:PATH = 'C:\Program Files\nodejs;' + $env:PATH
Set-Location 'C:\Users\harsh\OneDrive\Desktop\PortfolioFramed'
& 'C:\Program Files\nodejs\npm.cmd' run dev -- --host 0.0.0.0
