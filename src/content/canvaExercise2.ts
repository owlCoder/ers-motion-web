import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise2 = (): DocumentPage[] => [
  page('Vežba 2 — Git i GitHub: razvojni tok', [
    text('h1', 'Vežba 2 — Git i GitHub: razvojni tok'),
    text('paragraph', 'Git je distribuirani sistem za kontrolu verzije: svaki lokalni repozitorijum sadrži istoriju promena, dok udaljeni server služi koordinaciji rada i razmeni commit-a. U okviru predmeta Git se ne koristi kao rezervna kopija završne verzije, već kao trag odluka i razvoja kroz semestar.'),
    image('/course-assets/git-flow.svg', 'Od zahteva do integrisane promene: issue, grana, commit-i, pull request i main.', 'Git razvojni tok'),
    table(['Pojam', 'Praktična uloga'], [
      ['Working tree', 'Datoteke koje trenutno menjamo.'],
      ['Staging area', 'Izbor promena koje ulaze u naredni commit.'],
      ['Commit', 'Imenovana i identifikovana tačka istorije; Git je povezuje sa SHA identifikatorom.'],
      ['Remote', 'Udaljeni repozitorijum koji koordinira razmenu promena.'],
      ['Branch', 'Pokretni pokazivač na liniju razvoja koja omogućava izolovan rad.'],
      ['Pull request', 'Mesto za pregled diff-a, diskusiju i proveru pre integracije.'],
    ]),
  ]),
  page('2.1. Staging i commit', [
    text('h2', '2.1. Staging i commit'),
    text('paragraph', 'Komanda `git add` ne šalje promenu na GitHub. Ona priprema izabrane izmene za sledeći commit. Commit zatim beleži trenutno pripremljeno stanje u lokalnoj istoriji. Ovakva podela omogućava da se iz većeg broja lokalnih izmena formiraju mali i smisleni koraci razvoja.'),
    code('bash', `git status\ngit add src/Domain/Reservation.cs\ngit add tests/ReservationTests.cs\ngit diff --staged\ngit commit -m "Add reservation overlap rule"\ngit log --oneline --decorate -5`, 'Osnovni lokalni tok'),
    list([
      'Pre `git add` proveriti `git diff` i razumeti svaku promenu koja se sprema.',
      'Pre commit-a proveriti `git diff --staged`; staging area treba da predstavlja jednu koherentnu nameru.',
      'Poruka commit-a treba da opisuje promenu u imperativu ili drugom doslednom timu prihvaćenom stilu.',
      'Refaktorisanje i nova funkcionalnost ne treba automatski spajati u isti veliki commit.',
    ]),
    callout('note', 'Karakteristika dobrog commita', 'Dobar commit ostavlja repozitorijum u stanju koje može da se build-uje i, kada je primenljivo, testira. Reviewer treba da može da razume razlog promene bez otvaranja deset nepovezanih datoteka.'),
  ]),
  page('2.2. Udaljeni repozitorijum: fetch, pull i push', [
    text('h2', '2.2. Udaljeni repozitorijum: fetch, pull i push'),
    text('paragraph', '`git fetch` preuzima informacije o promenama sa udaljenog repozitorijuma bez menjanja trenutne lokalne grane. `git pull` najčešće kombinuje preuzimanje i integraciju, dok `git push` objavljuje lokalne commit-e na udaljenoj grani.'),
    table(['Komanda', 'Efekat'], [
      ['git fetch origin', 'Ažurira podatke o remote granama bez automatske izmene working tree-a.'],
      ['git pull origin main', 'Preuzima i integriše promene iz udaljene main grane.'],
      ['git push -u origin feature/x', 'Objavljuje lokalnu granu i postavlja upstream vezu.'],
      ['git clone <url>', 'Kreira lokalnu kopiju repozitorijuma sa istorijom i remote konfiguracijom.'],
    ]),
    code('bash', `git checkout main\ngit fetch origin\ngit log --oneline --left-right main...origin/main\ngit pull origin main\ngit checkout -b feature/equipment-reservation\ngit push -u origin feature/equipment-reservation`, 'Rad sa udaljenim repozitorijumom'),
    callout('warning', 'Force push nije redovan workflow', '`git push --force` prepisuje udaljenu istoriju i može ukloniti tuđe commit-e. Na deljenim granama ne koristi se bez jasnog razloga i dogovora. Ako je promena istorije neophodna, tim mora razumeti posledice.'),
  ]),
  page('2.3. Grane, konflikti i pull request', [
    text('h2', '2.3. Grane, konflikti i pull request'),
    text('paragraph', 'Feature grana izoluje promenu od stabilne linije razvoja. Konflikt se javlja kada Git ne može samostalno da odredi kako da spoji dve kompatibilne istorije. Rešavanje konflikta zato nije mehaničko brisanje markera, već odluka o tome koje ponašanje treba da ostane u konačnom kodu.'),
    diagram('Tipičan tok grane', [
      ['main', 'povući aktuelno stanje', 'blue'],
      ['feature branch', 'izolovati jednu temu', 'cyan'],
      ['commits', 'mali proverljivi koraci', 'violet'],
      ['pull request', 'review + build/test', 'amber'],
      ['merge', 'integracija u stabilnu granu', 'emerald'],
    ], 'PR je kontrolna tačka procesa, ne samo dugme za merge.'),
    code('bash', `git checkout main\ngit pull\ngit checkout feature/reservation-policy\ngit merge main\n# ručno rešiti konflikt u fajlu\ngit add src/Application/ReservationService.cs\ngit commit -m "Resolve reservation policy conflict"\ndotnet test`, 'Rešavanje konflikta i završna provera'),
    callout('task', 'Rad na vežbi', 'Napraviti dve grane koje menjaju isti deo jedne datoteke, izazvati konflikt, rešiti ga i nakon toga pokrenuti build/test. U PR opisu navesti šta je bilo u konfliktu i kako je provereno da konačno ponašanje odgovara zahtevu.'),
  ]),
  page('2.4. GitHub Desktop, Visual Studio i .gitignore', [
    text('h2', '2.4. Git kroz razvojno okruženje'),
    text('paragraph', 'Git operacije se mogu izvršavati iz komandne linije ili kroz grafičke klijente kao što su GitHub Desktop i integracija u Visual Studio. Grafički interfejs menja način pozivanja operacije, ali ne menja Git model: radne izmene, staging, commit, fetch, pull i push imaju isto značenje bez obzira na alat.'),
    table(['Grafička akcija', 'Git koncept / komanda'], [
      ['Changes', 'Izmene u working tree-u koje još nisu pripremljene za commit.'],
      ['Stage / +', '`git add` — izbor sadržaja za naredni commit.'],
      ['Commit', '`git commit` — upis nove tačke u lokalnu istoriju.'],
      ['Fetch', '`git fetch` — osvežavanje podataka o udaljenom repozitorijumu.'],
      ['Pull', '`git pull` — preuzimanje i integracija promena.'],
      ['Push', '`git push` — objavljivanje lokalnih commit-a na udaljenom repozitorijumu.'],
    ]),
    list([
      'U Visual Studio Git Changes prozoru prvo pregledati promenjene datoteke, zatim staged promene i tek onda kreirati commit.',
      'U `.gitignore` treba isključiti generisane i lokalne artefakte poput `bin/`, `obj/`, `.vs/` i lokalnih tajni ili korisničkih podešavanja.',
      'Korišćenje IDE-a ne menja potrebu da se razume razlika između commit-a i push-a, odnosno fetch-a i pull-a.',
      'Projektni repozitorijum je privatan tokom razvoja; članovi tima i predmetno osoblje dobijaju odgovarajući pristup.',
    ]),
    code('text', `# .gitignore — tipičan .NET minimum\nbin/\nobj/\n.vs/\n*.user\n*.suo\n.env\nappsettings.Development.local.json`, 'Osnovni .gitignore za .NET projekat'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Kreirati mali repozitorijum sa najmanje četiri smisleno odvojena commit-a, jednom feature granom i jednim pull request-om. U PR-u navesti koje su provere izvršene pre merge-a.'),
  ]),
  page('2.5. Projektni checkpoint: repozitorijum kao trag rada', [
    text('h2', '2.5. Projektni checkpoint'),
    text('paragraph', 'Od ove tačke studentski projekat mora imati uredan Git trag. Ne očekuje se savršena istorija, ali se očekuje da se razvoj može pratiti: zahtev treba da bude povezan sa promenom, promena sa commit-ima, a značajnija izmena sa pregledom i proverom.'),
    list([
      'Kreirati privatan projektni repozitorijum bez starter template-a.',
      'Dodati početni README sa nazivom teme, članovima tima i kratkim opisom problema.',
      'Definisati osnovni `.gitignore` pre prve ozbiljne implementacije.',
      'Dogovoriti pravilo imenovanja grana i commit poruka.',
      'Sačuvati najmanje jedan PR koji pokazuje review, build/test proveru ili argumentovanu diskusiju.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da objasni gde se promena nalazi u Git modelu, kako se bezbedno razmenjuje sa timom i zašto istorija razvoja predstavlja važan deo softverskog artefakta.'),
  ]),
]