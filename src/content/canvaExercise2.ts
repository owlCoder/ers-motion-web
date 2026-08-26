import type { DocumentPage } from '../types'
import { text, list, callout, code, table, image, diagram, page } from './canvaPracticumShared'

export const exercise2 = (): DocumentPage[] => [
  page('Vežba 2 — Git i GitHub: razvojni tok', [
    text('h1', 'Vežba 2 — Git i GitHub: razvojni tok'),
    text('paragraph', 'Git je distribuirani sistem za kontrolu verzije: svaki lokalni repozitorijum sadrži istoriju promena, dok udaljeni repozitorijum omogućava koordinaciju rada i razmenu commit-a. U okviru predmeta Git se ne koristi kao rezervna kopija završne verzije, već kao sledljiv zapis razvoja i donetih odluka tokom semestra.'),
    image('/course-assets/git-flow.svg', 'Od zahteva do integrisane promene: issue, grana, commit-i, pull request i stabilna main grana.', 'Git razvojni tok'),
    table(['Pojam', 'Praktična uloga'], [
      ['Working tree', 'Datoteke koje trenutno menjamo.'],
      ['Staging area', 'Izbor promena koje će ući u naredni commit.'],
      ['Commit', 'Identifikovana tačka istorije sa porukom koja opisuje nameru promene.'],
      ['Remote', 'Udaljeni repozitorijum preko kog tim razmenjuje promene.'],
      ['Branch', 'Pokretni pokazivač na liniju razvoja koji omogućava izolovan rad.'],
      ['Pull request', 'Mesto za pregled diff-a, diskusiju i proveru pre integracije.'],
    ]),
  ]),
  page('2.1. Staging i commit', [
    text('h2', '2.1. Staging i commit'),
    text('paragraph', 'Komanda `git add` ne šalje promenu na GitHub. Ona priprema izabrane izmene za sledeći commit. Commit zatim beleži pripremljeno stanje u lokalnoj istoriji. Ovakva podela omogućava da se iz većeg broja lokalnih izmena formiraju mali, koherentni i pregledni koraci razvoja.'),
    code('bash', `git status\ngit add src/Domain/Reservation.cs\ngit add tests/ReservationTests.cs\ngit diff --staged\ngit commit -m "Add reservation overlap rule"\ngit log --oneline --decorate -5`, 'Osnovni lokalni tok'),
    list([
      'Pre `git add` proveriti `git diff` i razumeti svaku promenu koja se priprema.',
      'Pre commit-a proveriti `git diff --staged`; staging area treba da predstavlja jednu koherentnu nameru.',
      'Poruka commit-a treba sažeto da opiše nameru promene u doslednom stilu koji je tim prethodno dogovorio.',
      'Refaktorisanje i uvođenje nove funkcionalnosti ne treba automatski spajati u isti veliki commit.',
    ]),
    callout('note', 'Karakteristika kvalitetnog commit-a', 'Kvalitetan commit ostavlja repozitorijum u stanju u kome projekat može uspešno da se izgradi i, kada je primenljivo, da prođe testove. Pregledalac treba da razume razlog promene bez analiziranja velikog broja nepovezanih datoteka.'),
  ]),
  page('2.2. Udaljeni repozitorijum: fetch, pull i push', [
    text('h2', '2.2. Udaljeni repozitorijum: fetch, pull i push'),
    text('paragraph', '`git fetch` preuzima informacije o promenama sa udaljenog repozitorijuma bez izmene trenutne lokalne grane. `git pull` najčešće kombinuje preuzimanje i integraciju, dok `git push` objavljuje lokalne commit-e na udaljenoj grani.'),
    table(['Komanda', 'Efekat'], [
      ['git fetch origin', 'Ažurira podatke o udaljenim granama bez automatske izmene radnog stabla.'],
      ['git pull origin main', 'Preuzima i integriše promene iz udaljene main grane.'],
      ['git push -u origin feature/x', 'Objavljuje lokalnu granu i postavlja upstream vezu.'],
      ['git clone <url>', 'Kreira lokalnu kopiju repozitorijuma sa istorijom i remote konfiguracijom.'],
    ]),
    code('bash', `git checkout main\ngit fetch origin\ngit log --oneline --left-right main...origin/main\ngit pull origin main\ngit checkout -b feature/equipment-reservation\ngit push -u origin feature/equipment-reservation`, 'Rad sa udaljenim repozitorijumom'),
    callout('warning', 'Force push nije deo uobičajenog timskog toka', '`git push --force` prepisuje udaljenu istoriju i može ukloniti tuđe commit-e. Na deljenim granama ne koristi se bez jasnog razloga i prethodnog dogovora. Ako je izmena istorije neophodna, tim mora razumeti posledice i način oporavka.'),
  ]),
  page('2.3. Grane, konflikti i pull request', [
    text('h2', '2.3. Grane, konflikti i pull request'),
    text('paragraph', 'Feature grana izoluje promenu od stabilne linije razvoja. Konflikt nastaje kada Git ne može automatski da odredi kako treba spojiti konkurentne izmene. Rešavanje konflikta zato nije mehaničko uklanjanje markera, već inženjerska odluka o tome koje ponašanje treba da ostane u konačnoj verziji.'),
    diagram('Tipičan tok grane', [
      ['main', 'preuzeti aktuelno stanje', 'blue'],
      ['feature branch', 'izolovati jednu temu', 'cyan'],
      ['commit-i', 'mali proverljivi koraci', 'violet'],
      ['pull request', 'pregled, izgradnja i testovi', 'amber'],
      ['merge', 'integracija u stabilnu granu', 'emerald'],
    ], 'Pull request je kontrolna tačka procesa, a ne samo tehnički korak za spajanje grana.'),
    code('bash', `git checkout main\ngit pull\ngit checkout feature/reservation-policy\ngit merge main\n# ručno rešiti konflikt u datoteci\ngit add src/Application/ReservationService.cs\ngit commit -m "Resolve reservation policy conflict"\ndotnet test`, 'Rešavanje konflikta i završna provera'),
    callout('task', 'Rad na vežbi', 'Napraviti dve grane koje menjaju isti deo jedne datoteke, izazvati konflikt, rešiti ga i nakon toga proveriti izgradnju projekta i testove. U opisu pull request-a navesti uzrok konflikta i način na koji je potvrđeno konačno ponašanje.'),
  ]),
  page('2.4. GitHub Desktop, Visual Studio i .gitignore', [
    text('h2', '2.4. Git kroz razvojno okruženje'),
    text('paragraph', 'Git operacije mogu se izvršavati iz komandne linije ili kroz grafičke klijente kao što su GitHub Desktop i integracija u Visual Studio. Grafički interfejs menja način pokretanja operacije, ali ne menja Git model: radne izmene, staging, commit, fetch, pull i push imaju isto značenje bez obzira na izabrani alat.'),
    image('/course-assets/git-desktop-workflow.svg', 'GitHub Desktop prikazuje iste osnovne elemente Git modela: promene u radnom stablu, istoriju commit-a i sinhronizaciju sa udaljenim repozitorijumom.', 'GitHub Desktop tok rada'),
    image('/course-assets/visual-studio-git-changes.svg', 'Visual Studio Git Changes omogućava pregled diff-a, izbor promena za commit i sinhronizaciju bez napuštanja razvojnog okruženja.', 'Visual Studio Git Changes'),
    table(['Grafička akcija', 'Git koncept ili komanda'], [
      ['Changes', 'Izmene u working tree-u koje još nisu pripremljene za commit.'],
      ['Stage / +', '`git add` — izbor sadržaja za naredni commit.'],
      ['Commit', '`git commit` — upis nove tačke u lokalnu istoriju.'],
      ['Fetch', '`git fetch` — osvežavanje podataka o udaljenom repozitorijumu.'],
      ['Pull', '`git pull` — preuzimanje i integracija promena.'],
      ['Push', '`git push` — objavljivanje lokalnih commit-a na udaljenom repozitorijumu.'],
    ]),
    list([
      'U Visual Studio Git Changes prozoru najpre pregledati promenjene datoteke i diff, zatim pripremljene promene, a tek potom kreirati commit.',
      'U `.gitignore` treba isključiti generisane i lokalne artefakte kao što su `bin/`, `obj/`, `.vs/`, lokalne tajne i korisnička podešavanja.',
      'Korišćenje IDE-a ne menja potrebu da se razume razlika između commit-a i push-a, odnosno fetch-a i pull-a.',
      'Projektni repozitorijum je privatan tokom razvoja; članovi tima i predmetno osoblje dobijaju odgovarajući pristup.',
    ]),
    code('text', `# .gitignore — tipičan .NET minimum\nbin/\nobj/\n.vs/\n*.user\n*.suo\n.env\nappsettings.Development.local.json`, 'Osnovni .gitignore za .NET projekat'),
    callout('task', 'Mini domaći — bonus 1 bod', 'Kreirati mali repozitorijum sa najmanje četiri smisleno odvojena commit-a, jednom feature granom i jednim pull request-om. U opisu pull request-a navesti koje su provere izvršene pre integracije promene.'),
  ]),
  page('2.5. Projektna kontrolna tačka: repozitorijum kao trag rada', [
    text('h2', '2.5. Projektna kontrolna tačka — repozitorijum kao trag rada'),
    text('paragraph', 'Od ove tačke studentski projekat mora imati uredan Git trag. Ne očekuje se savršena istorija, ali se očekuje da se razvoj može rekonstruisati: zahtev treba da bude povezan sa promenom, promena sa commit-ima, a značajnija izmena sa pregledom i proverom.'),
    list([
      'Kreirati privatan projektni repozitorijum bez unapred pripremljenog projektnog šablona.',
      'Dodati početni README sa nazivom teme, članovima tima i kratkim opisom problema.',
      'Definisati osnovni `.gitignore` pre početka ozbiljnije implementacije.',
      'Dogovoriti pravilo imenovanja grana i poruka commit-a.',
      'Sačuvati najmanje jedan pull request koji pokazuje pregled promene, proveru izgradnje/testova ili argumentovanu diskusiju.',
    ]),
    callout('success', 'Ishod vežbe', 'Student ume da objasni gde se promena nalazi u Git modelu, kako se bezbedno razmenjuje sa timom i zbog čega istorija razvoja predstavlja važan deo softverskog artefakta.'),
  ]),
]
