# 🇩🇰 Pant-Afhentning

En mobil-først webapplikation bygget med Vue.js og Vuetify til håndtering af pant-scanning og anmodning om afhentning.

<br>

## 🗺️ Indholdsfortegnelse

  - [Om Projektet](https://www.google.com/search?q=%23-om-projektet)
      - [Formål](https://www.google.com/search?q=%23form%C3%A5l)
      - [Kernefunktioner](https://www.google.com/search?q=%23kernefunktioner)
  - [🚀 Teknologioversigt](https://www.google.com/search?q=%23-teknologioversigt)
  - [📁 Projektstruktur](https://www.google.com/search?q=%23-projektstruktur)
  - [⚡ Central Datastyring (Provide/Inject)](https://www.google.com/search?q=%23-central-datastyring-provideinject)
  - [🧩 Komponentbibliotek](https://www.google.com/search?q=%23-komponentbibliotek)
  - [🗺️ Routing](https://www.google.com/search?q=%23-routing)
  - [🎨 Styling og Tema](https://www.google.com/search?q=%23-styling-og-tema)
  - [🔧 Installation og Opsætning](https://www.google.com/search?q=%23-installation-og-ops%C3%A6tning)
      - [Tilgængelige Scripts](https://www.google.com/search?q=%23tilg%C3%A6ngelige-scripts)

-----

## 🎯 Om Projektet

### Formål

`pant-afhentning` er en Vue.js-applikation designet til at strømline processen med at returnere pant. Projektet har to primære brugergrupper:

1.  **Forbrugere:** Kan scanne deres pant-artikler via telefonens kamera, gemme deres scanninger, se en historik over deres pant, og anmode om afhentning af deres pant, når de har nået et minimumsbeløb.
2.  **Afhentere:** Har en særskilt portal, hvor de kan se en liste over adresser, der har anmodet om afhentning, og få vist en rutevejledning.

### Kernefunktioner

  * **Brugergodkendelse:** Komplet flow med Opret Bruger (multi-step form) og Bruger Login.
  * **Stregkodescanning:** Realtids-scanning af stregkoder ved hjælp af enhedens kamera.
  * **Aktivitetshåndtering:** Brugere kan gemme scanninger som "aktiviteter" og se deres historik.
  * **Anmod om Afhentning:** Brugere kan anmode om afhentning for gemte aktiviteter, der overstiger et minimumsbeløb (100 kr.).
  * **Statistik og Profil:** Brugere kan se deres personlige oplysninger og statistik over deres samlede scanninger og pant-værdi.
  * **Afhenter-Portal:** En separat visning for afhentere til at administrere afhentningsanmodninger.
  * **Fejlrapportering:** Mulighed for brugere at rapportere fejl på en afsluttet scanning.

-----

## 🚀 Teknologioversigt

  * **Framework:** [Vue.js](https://vuejs.org/) (v3.2.13)
  * **UI Bibliotek:** [Vuetify](https://vuetifyjs.com/) (v3.0.0-beta.0)
  * **Routing:** [Vue Router](https://router.vuejs.org/) (v4.6.3)
  * **Stregkodescanning:** [ZXing Library](https://github.com/zxing-js/library)
  * **Linting:** ESLint
  * **Build Værktøj:** Vue CLI

-----

## 📁 Projektstruktur

Projektet følger en standard Vue CLI-struktur. De mest relevante mapper er:

```
pant-afhentning/
├── public/
│   └── index.html          # HTML-skabelon
├── src/
│   ├── assets/             # Statiske billeder (kort, logoer)
│   ├── components/
│   │   ├── barcodeScanner/ # Scannings-specifikke komponenter
│   │   ├── scannerDialog.vue/ # Dialoger til afslutning af scanning
│   │   ├── BottomMenuBar.vue   # Hovednavigation i bunden
│   │   ├── BurgerMenu.vue      # Top-bar og sidemenu
│   │   ├── ...               # Andre genbrugelige komponenter
│   ├── Pages/
│   │   ├── HomeView.vue        # Hjemmeskærm/dashboard
│   │   ├── MyProfile.vue       # Brugerprofil-side
│   │   ├── PantDetails.vue     # Detaljer for én scanning
│   │   ├── PantHistory.vue     # Historik-side
│   │   ├── RegisterUser.vue    # Opret bruger-side
│   │   ├── UserLogin.vue       # Login-side
│   │   ├── barcodeScanner.vue  # Scannings-siden
│   │   └── ...               # Andre sider
│   ├── plugins/
│   │   ├── vuetify.js          # Vuetify-konfiguration og tema
│   │   └── webfontloader.js    # Indlæsning af skrifttype
│   ├── App.vue               # App'ens rod-komponent
│   └── main.js               # App'ens indgangspunkt (router, vuetify)
├── package.json              # Projektets afhængigheder og scripts
└── vue.config.js             # Vue CLI-konfiguration
```

-----

## ⚡ Central Datastyring (Provide/Inject)

Applikationen bruger Vues `provide` / `inject` API til at håndtere global state, der deles fra `src/App.vue`.

En statisk `pantHistory`-liste initialiseres i `App.vue`. En `computed` property ved navn `activities` bruges til at beregne de samlede priser (`price`) og antal (`amount`) for hver post i historikken.

Disse data, sammen med `statusMap` og `getStatusColor`-metoden, stilles til rådighed for alle underkomponenter:

```javascript
// I App.vue
provide() {
  return {
    activities: this.activities, // Beregnet data med totaler
    statusMap: this.statusMap,
    getStatusColor: this.getStatusColor,
  };
},
```

Komponenter som `PantHistory.vue`, `PantDetails.vue`, `MyProfile.vue` og `OrderPickUpModal.vue` bruger `inject: ["activities", ...]` for at få adgang til disse data uden behov for props.

-----

## 🧩 Komponentbibliotek

Dette er en oversigt over applikationens primære sider og genbrugelige komponenter.

\<details\>
\<summary\>\<strong\>Klik for at se Sider (Pages)\</strong\>\</summary\>

**`HomeView.vue`**

  * **Rute:** `/`
  * **Formål:** Appens startskærm (dashboard).
  * **Logik:** Viser to store handlingsknapper: "Start scanning" (linker til `/scan`) og "Anmod afhentning" (åbner `OrderPickUpModal`). Viser en sektion "Seneste aktivitet" ved at indlejre `PantHistory.vue`-komponenten.

**`UserLogin.vue`**

  * **Rute:** `/login`
  * **Formål:** Håndterer brugerlogin.
  * **Logik:** Simpel formular med e-mail og adgangskode. Inkluderer `LogoBanner`. Validerer input og simulerer login ved at sende brugeren til `/`.

**`RegisterUser.vue`**

  * **Rute:** `/register`
  * **Formål:** Håndterer oprettelse af ny bruger.
  * **Logik:** Bruger en `v-stepper` med 3 trin: "Personlig Info", "Adresse" og "Sikkerhed". Indeholder omfattende valideringsregler.

**`PantHistory.vue`**

  * **Rute:** `/min-pant` (bruges også af `HomeView.vue`)
  * **Formål:** Viser en komplet liste over brugerens pant-aktiviteter.
  * **Logik:** Modtager `activities` via `inject`. Viser en `v-table` med "Dato", "Status" og "Kr.". Rækker er "klikkable" og kan udvides for at vise en opsummering af varerne.

**`PantDetails.vue`**

  * **Rute:** `/scanning/:id`
  * **Formål:** Viser detaljeret information om én specifik pant-aktivitet.
  * **Logik:** Henter den specifikke aktivitet fra de `inject`-ede `activities` baseret på `id`-parameteren. Viser en liste over alle "Indsamlede varer" og beregner "Total antal" og "Total pant værdi". Viser en `BugReportButton`, hvis aktiviteten er afsluttet (status 4).

**`barcodeScanner.vue`**

  * **Rute:** `/scan`
  * **Formål:** Hovedsiden for scanning af stregkoder.
  * **Logik:** Integrerer `StreamBarcodeReader`. Har en 2-sekunders `scanCooldown` for at forhindre dobbelscanninger. Når en stregkode scannes, øges antallet (`count`) for den pågældende vare. Viser en sorteret liste over scannede varer og en `totalSum`.

**`AfhenterPage.vue`**

  * **Rute:** `/afhenter`
  * **Formål:** En portal for afhentere/chauffører.
  * **Logik:** Viser to tabeller: "Pant til afhentning" og "Pant allerede hentet". Giver mulighed for at gå til vejvisning (`GoToMap`) eller markere som hentet (`moveToPickedUp`).

**`VejvisningPage.vue`**

  * **Rute:** `/vejvisning/:address`
  * **Formål:** Viser en rutevejledning.
  * **Logik:** Viser adressen fra route-parameteren og et statisk billede (`kort.png`) som kort.

**`MyProfile.vue`**

  * **Rute:** `/min-profil`
  * **Formål:** Viser brugerens profil og indstillinger.
  * **Logik:** Viser statiske brugeroplysninger. Beregner "Statistik" (Total Scanninger, Total Pant Værdi) baseret på `inject`-ede `activities`. Indeholder en "Log ud"-knap.

\</details\>

\<details\>
\<summary\>\<strong\>Klik for at se Komponenter (Components)\</strong\>\</summary\>

**`BottomMenuBar.vue`**

  * **Formål:** Appens primære navigation i bunden af skærmen.
  * **Logik:** Bruger `v-bottom-navigation` med fire links: Hjem, Min Pant, Afhenter og Profil. Viser en central `v-fab` (flydende knap), der linker til `/scan`. Denne knap skjules på `/scan` og login-siderne.

**`BurgerMenu.vue`**

  * **Formål:** Fungerer som appens top-bar og den dertilhørende "burger"-sidemenu.
  * **Logik:** Viser logo og en menu-knap, der åbner en `v-navigation-drawer`. Menuen indeholder et link til "Pant priser", som åbner en `v-dialog` med prisinformation.

**`NavigationHeader.vue`**

  * **Formål:** En sekundær top-bar, der vises på undersider.
  * **Logik:** Vises ikke på Hjem, Login, Register og Profil. Viser en "Tilbage"-pil og en dynamisk `pageTitle` baseret på den aktuelle rute.

**`OrderPickUpModal.vue`**

  * **Formål:** Dialog til at anmode om afhentning.
  * **Logik:** Modtager `activities` via `inject`. Viser en `v-select` med gemte aktiviteter (`status === 1`). Emner i dropdown-menuen er deaktiverede, hvis prisen er under 100 kr.

**`ReportModal.vue`**

  * **Formål:** Dialog til at rapportere en fejl.
  * **Logik:** Indeholder en `v-select` med årsager ("Forkert pant registreret", "Manglende penge på konto", "Andet") og et `v-textarea` til kommentarer.

**`StreamBarcodeReader.vue`**

  * **Formål:** Genbrugelig komponent til at vise en live video-stream og scanne stregkoder.
  * **Logik:** Bruger `BrowserMultiFormatReader.decodeFromVideoDevice` fra ZXing. Viser en video, et overlay og en animeret "laser". Udsender `decode` (med tekstresultatet), når en stregkode er læst.

**`dialogTemplate.vue`**

  * **Formål:** Footer-menu på `barcodeScanner.vue` til at afslutte en scanning.
  * **Logik:** Viser "Gem scanning" og "Anmod afhentning". Hvis brugeren anmoder om afhentning og `totalSum` er under 100 kr., vises en advarselsdialog (`dialog2`), der informerer om minimumsbeløbet.

\</details\>

-----

## 🗺️ Routing

Rute-definitionerne findes i `src/main.js`:

| Sti (Path) | Komponent | Navn (Name) | Formål |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | `home` | Hjemmeskærm / Dashboard. |
| `/register` | `RegisterUser` | `RegisterUser` | Opret ny bruger. |
| `/login` | `UserLogin` | `UserLogin` | Log ind eksisterende bruger. |
| `/min-pant` | `PantHistory` | `PantHistory` | Oversigt over alle pant-aktiviteter. |
| `/scanning/:id` | `PantDetails` | `scanning` | Detaljeret visning af én aktivitet. |
| `/scan` | `barcodeScanner` | `scan` | Start scanning af stregkoder. |
| `/afhenter` | `AfhenterPage` | `Afhenter` | Portal for afhentere. |
| `/vejvisning/:address` | `VejvisningPage` | `Vejvisning` | Viser kort/adresse til afhenter. |
| `/min-profil` | `MyProfile` | `MyProfile` | Brugerprofil og indstillinger. |

-----

## 🎨 Styling og Tema

Applikationen bruger **Vuetify** til alle UI-komponenter. Et brugerdefineret tema er defineret i `src/plugins/vuetify.js` med følgende farvepalette:

  * `primary`: `#009FE4` (Blå)
  * `secondary`: `#93C14E` (Grøn)
  * `light`: `#B0B0B0`
  * `dark`: `#585858`
  * `error`: `#FF0000`

Skrifttyper (primært Roboto) indlæses via `src/plugins/webfontloader.js`.

-----

## 🔧 Installation og Opsætning

### Projektopsætning

```bash
npm install
```

### Tilgængelige Scripts

Disse scripts er defineret i `package.json`:

**Kompilerer og hot-reloader til udvikling**

```bash
npm run serve
```

**Kompilerer og minificerer til produktion**

```bash
npm run build
```

**Linter og retter filer**

```bash
npm run lint
```
