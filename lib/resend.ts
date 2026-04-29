import { Resend } from 'resend'
import { DocumentSections } from '@/types'

export const resend = new Resend(process.env.RESEND_API_KEY)

export function buildEmailHtml(document: DocumentSections): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
body { background: #0D0D0D; color: #F5EDD6; font-family: Georgia, serif; padding: 2rem; }
h1 { color: #C9A84C; font-size: 1.8rem; margin-bottom: 0.5rem; }
h2 { color: #C9A84C; font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.5rem; }
p { line-height: 1.7; font-size: 1rem; margin: 0 0 0.5rem; }
.declaration { font-style: italic; text-align: center; color: #C9A84C; font-size: 1.1rem; }
.intention { border-top: 1px solid rgba(201,168,76,0.3); padding-top: 1rem; margin-top: 1.5rem; }
.invitation { color: #4A4A4A; font-style: italic; font-size: 0.9rem; margin-top: 1rem; }
</style></head>
<body>
<h1>${document.name}</h1>
<h2>Who You Are</h2><p>${document.whoYouAre}</p>
<h2>Where You Are</h2><p>${document.whereYouAre}</p>
<h2>What Is In The Way</h2><p>${document.whatIsInTheWay}</p>
<h2>What You Are Here For</h2><p>${document.whatYouAreHereFor}</p>
<h2>Your Next Steps</h2><p>${document.yourNextSteps}</p>
<h2>Your Declaration</h2><p class="declaration">${document.yourDeclaration}</p>
<div class="intention">
<h2>Your 7-Day Intention</h2><p>${document.sevenDayIntention}</p>
</div>
<p class="invitation">${document.openInvitation}</p>
</body>
</html>`
}
