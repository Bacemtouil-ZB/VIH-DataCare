# I18N Extension (FR + AR) - App Mobile

## Chniya 3malt
- Kammelt nafs architecture i18n (context + `t(key)` + AsyncStorage) 3al app kolha, moch login bark.
- L user tnajjem ikhtar `FR` wala `AR` men login, w l choix yet7fadh ba3d restart.
- Baddelt texts statiques fil pages lokhrin (home, rappels, rendez-vous, suivi, urgence, change password) l keys mta3 traduction.
- Zedt support lel texts dynamiques:
  - counters (ex: nombre de rappels / contacts)
  - labels status
  - countdown text
- Na99it w 9awit code structure:
  - `translations.js` became central source
  - `t()` supporti placeholders/functions
  - fallback translation 3ala langue par defaut
- Zedt translation lel notification channel + local reminder notifications zeda (title/body) 7asb langue choisie.
- Slahit bug pre-existant fi rendez-vous screen (`import .zz`) elli ken ykasser build.

## Architecture i18n (final)
1. `src/i18n/translations.js`
   - fih kol keys FR/AR mratbin bel domains (`login`, `home`, `reminders`, `rendezvous`, `suivi`, `urgence`, `tabs`, `common`, ...)
2. `src/i18n/i18nContext.jsx`
   - state mta3 `language`
   - persistence b `AsyncStorage`
   - `t(key, params)` (supports interpolation + function values)
   - `isRTL` + `locale`
3. `src/i18n/useI18n.js`
   - hook wahda bech kol screen/component yest3ml i18n b clean way

## Pages/modules li tbadlou
- Auth:
  - `loginScreen`, `loginForm`, `languageSwitcher`
  - `changePasswordScreen`, `ChangePasswordForm`
- Navigation:
  - custom tab bar labels wallaw dynamiques bel i18n
- Home:
  - greeting, actions, next rendez-vous, reminders of day
- Reminders:
  - list/create/card/toasts/types/repeats
- Rendez-vous:
  - list/detail/card/status labels/errors/retry
- Suivi:
  - header/messages/charts legends/texts/access states
- Urgence:
  - header/banner/counts/empty/error
- Shared:
  - `ErrorMessage`, `EmptyState`
- Notifications:
  - channel name + local notification text by selected language

## Files mta3 i18n (core)
- `src/i18n/translations.js`
- `src/i18n/i18nContext.jsx`
- `src/i18n/useI18n.js`

## Validation li 3maltha
1. Syntax parse 3al files lkol:
```bash
node -e "..."   # parser check
```
Result: `PARSE_OK`.

2. Build web export:
```bash
npx expo export --platform web --output-dir dist-test
```
Result: `Web Bundled ... Exported: dist-test` (success).

## Kifeh ttesti enti
1. Chaghhel app:
```bash
npm run start
```
2. Men login, baddel `FR` / `AR`.
3. Dour 3al pages:
   - Home
   - Rendez-vous (list/detail)
   - Rappels (list/create)
   - Suivi
   - Urgence
   - Change password
4. Sakkar w 3awed 7el app: verify elli nafs language ba9ya.
5. (Optionnel) jarrab add reminder w chouf notification text ki yji bel langue el mokhtara.
