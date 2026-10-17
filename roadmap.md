# Roadmap

- [ ] Fix visuele/UI-problemen in "Live integratie toevoegen" pop-up (AddLiveIntegrationModal): verticale lijst, categoriebalk bovenaan (Aanbevolen / Alles / Games / …)
- [ ] AddComponentModal: "Live Status & Feeds" niet meer als eerste bovenaan; keuzes onder elkaar in de pop-up met categoriebalk bovenaan
- [ ] Totaal bereik verhuizen naar per-koppeling uitklapbare rij (zoals Live Integraties): verifiëren/ongedaan maken, verwijderen, bereik/volgers tonen met platform-specifieke naam (YouTube → abonnees); optie verbergen als platform geen data kan ophalen of echte koppeling vereist
- [ ] QR, privacy & delen: automatische per-user preview-afbeelding (/api/public/og/<handle>.png) en preview-tekst tonen in ShareInspector; gebruiker kan overschrijven

- [ ] Vertalingen: ~2000 vaste teksten in componenten/pagina's omzetten (scan: bun scripts/i18n-hardcoded.ts)
- [x] Legal: privacy OAuth/API section, terms third-party/UGC/indemnity, /data-deletion page, footer links
- [x] YouTube Kaart (vault koppeling, profielkaart, ontkoppelen)
- [x] db/95_youtube_vault.sql toegepast op Neon (Google Cloud-instellingen nog door jou)
- [x] Mails: transactional tags + X-Mailin-Tag, one light design for all mails (incl. fallback frame), sync script
- [ ] Brevo-templates uploaden: `bun scripts/sync-brevo-templates.ts` (wacht op BREVO_API_KEY)
- [x] Live-component panel gekoppeld aan de componentenlijst (koppelen, officieel koppelen, ontkoppelen, stat-schakelaars)
- [x] YouTube-component: eigen koppel/toon/ontkoppel-knoppen + aantal video's
- [ ] In de browser testen met database (wacht op DATABASE_URL)
- [x] Duolingo live component (gebruikersnaam, streak/taal/XP, profielkaart)
- [x] Neon gekoppeld + db/95_youtube_vault.sql toegepast
- [ ] WakaTime OAuth (notities ontvangen)
- [ ] Trakt.tv + Steam OAuth/PKCE (notities ontvangen)

## Feedback 17/10
- [ ] Inlogmails naar @rout.be-adressen komen niet aan (publiek + admin)
- [x] Mede-admins kunnen niet inloggen op admin-portaal (rol niet doorgevoerd)
- [x] Admin: Verificaties & aanvragen en Cadeaubonnen openen zonder zijbalk
- [x] Admin: Verificaties & aanvragen indelen (ingediend / bezig / gelukt / mislukt)
- [ ] Admin: OAuth-apps verificatiescherm indelen (oud/nieuw, mappen)
- [x] Admin: Cadeaubonnen toevoegen/genereren-knop; "Publiek profiel" moet naar rout.be linken
- [ ] Eigen badges: transparante achtergrond bij upload behouden
- [x] ROUT-presets kleiner (mobiel 4 per rij)
- [x] Knoppen & Typografie: zelfde "aanpassen"-knop als Achtergrond & Visual FX
- [x] "Made with ROUT"-voetnoot standaard aan (was al zo)
- [ ] Pro-ontgrendeling moet voor beide profielen gelden
- [x] Hoekafronding en Knopstijl: opties duidelijk verschillend maken
- [x] Knopvorm: ronde bol (alleen icoon) of lijn met naam, met toegankelijkheidsmelding
- [x] Profielhub: niet verspringen bij openen/sluiten van mappen of pop-ups

## Security & Discord 17/10
- [x] Open redirects dichten (safeRedirect: alleen relatief, rout.be, rout.dlp.li)
- [x] Inlogcodes en berichtinhoud uit logs
- [ ] Discord OAuth (identify + connections), versleutelde tokens, profielkaart, ontkoppelen (wacht op DISCORD_CLIENT_ID/SECRET)

## Workspaces & Developer Console (overdracht 17/10)
- [x] db/96_workspaces.sql toegepast op Neon
- [x] assertWorkspaceRole + active_workspace_id-cookie, console/OAuth-routes beveiligen
- [x] Workspace-switcher linksboven
- [x] Team-tabblad in instellingen (leden, rollen, uitnodigen)
- [x] Console-menu verbergen voor editors
- [x] Tests + AGENTS.md-regel
