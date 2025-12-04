Stremio

Un addon per Stremio che estrae sorgenti di streaming da VixSRC.to, fornendo link di streaming per film e serie TV.

## Caratteristiche

- **Supporto per Film**: Estrae stream per film utilizzando ID IMDB/TMDB
- **Supporto per Serie TV**: Estrae stream per episodi di serie TV con formato stagione/episodio
- **Integrazione Stremio**: Integrazione perfetta con l'interfaccia di Stremio
- **Conversione ID**: Conversione automatica da IMDB ID a TMDB ID
- **Personalizzazione**: Supporta i parametri di personalizzazione di VixSRC

## Differenze rispetto a StremSRC originale

Questo addon Ã¨ basato sul progetto [StremSRC](https://github.com/ThEditor/stremsrc) ma Ã¨ stato modificato per utilizzare **VixSRC.to** invece di VidSRC:

### API Endpoints
- **VidSRC originale**: `/embed/movie/{id}` e `/embed/tv/{id}/{season}/{episode}`
- **VixSRC modificato**: `/movie/{tmdbId}` e `/tv/{tmdbId}/{season}/{episode}`

### Parametri supportati
VixSRC supporta parametri di personalizzazione:
- `primaryColor`: Colore primario del player
- `secondaryColor`: Colore della barra di progresso
- `autoplay`: Controllo autoplay
- `lang`: Lingua preferita per l'audio

## Installazione

### Istanza Pubblica

L'addon sarÃ  disponibile a:
**https://vixsrc-addon.vercel.app**

Per installare in Stremio:
1. Apri Stremio
2. Vai su Impostazioni â†’ Addon
3. Clicca "Aggiungi Addon"
4. Inserisci: `https://vixsrc-addon.vercel.app/manifest.json`
5. Clicca "Installa"

### Sviluppo Locale

1. Clona questo repository:
```bash
git clone https://github.com/tuonome/vixsrc-addon.git
cd vixsrc-addon
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura la chiave API TMDB:
```bash
export TMDB_API_KEY=your_tmdb_api_key_here
```

4. Compila il progetto:
```bash
npm run build
```

5. Avvia l'addon:
```bash
npm start
```

L'addon sarÃ  disponibile su `http://localhost:56245`

### Deploy su Vercel

1. Fai il fork di questo repository
2. Crea un nuovo progetto su Vercel collegando il repository
3. Aggiungi la variabile d'ambiente `TMDB_API_KEY` nelle impostazioni Vercel
4. Deploya il progetto

## Configurazione

### Chiave API TMDB

Per utilizzare la conversione da IMDB ID a TMDB ID, Ã¨ necessaria una chiave API di The Movie Database:

1. Registrati su [TMDB](https://www.themoviedb.org/)
2. Vai su Impostazioni â†’ API
3. Richiedi una chiave API
4. Configura la variabile d'ambiente `TMDB_API_KEY`

### Variabili d'ambiente

- `TMDB_API_KEY`: Chiave API di TMDB (richiesta per la conversione ID)
- `PORT`: Porta del server (default: 56245)

## Struttura del Progetto

```
src/
â”œâ”€â”€ index.ts          # Server principale e configurazione addon
â”œâ”€â”€ extractor.ts      # Logica di estrazione da VixSRC
â”œâ”€â”€ package.json      # Dipendenze e script
â”œâ”€â”€ tsconfig.json     # Configurazione TypeScript
â”œâ”€â”€ vercel.json       # Configurazione deploy Vercel
â””â”€â”€ README.md         # Documentazione
```

## Come Funziona

1. **Richiesta Stream**: Stremio invia una richiesta per uno stream con tipo (movie/series) e ID
2. **Conversione ID**: Se l'ID Ã¨ IMDB (inizia con "tt"), viene convertito in TMDB ID
3. **Costruzione URL**: Viene costruito l'URL VixSRC appropriato
4. **Estrazione**: L'addon estrae i link di streaming dalla pagina VixSRC
5. **Risposta**: Ritorna i stream a Stremio con parametri di personalizzazione

## API VixSRC

### Endpoint per Film
```
https://vixsrc.to/movie/{tmdbId}
```

### Endpoint per Serie TV
```
https://vixsrc.to/tv/{tmdbId}/{season}/{episode}
```

### Parametri di Personalizzazione
- `primaryColor=B20710`: Colore primario
- `secondaryColor=170000`: Colore secondario
- `autoplay=false`: Disabilita autoplay
- `lang=it`: Lingua italiana

## Esempio d'uso

```typescript
// Per un film
const streams = await extractStreams('movie', 'tt1254207');

// Per una serie TV
const streams = await extractStreams('series', 'tt0944947', '1', '5');
```

## Limitazioni

- Richiede una chiave API TMDB per la conversione ID
- Dipende dalla disponibilitÃ  di VixSRC.to
- La qualitÃ  e disponibilitÃ  degli stream dipende da VixSRC

## Risoluzione Problemi

### L'addon non trova stream
- Verifica che VixSRC.to sia accessibile
- Controlla che la chiave API TMDB sia configurata correttamente
- Assicurati che l'ID del contenuto sia valido

### Errori di conversione ID
- Verifica la validitÃ  della chiave API TMDB
- Controlla che l'ID IMDB sia nel formato corretto (es. tt1234567)

## Contribuire

1. Fai il fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit le tue modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Questo progetto Ã¨ solo per scopi educativi. Assicurati di rispettare le leggi applicabili e i termini di servizio quando utilizzi sorgenti di streaming.

## Crediti

- Logica di estrazione originale basata su [StremSRC](https://github.com/ThEditor/stremsrc)
- Modificato per utilizzare VixSRC.to API
- Utilizza [Stremio Addon SDK](https://github.com/Stremio/stremio-addon-sdk)

## Disclaimer

Questo addon Ã¨ fornito solo per scopi educativi e di ricerca. Gli utenti sono responsabili di assicurarsi che l'uso sia conforme alle leggi locali e ai termini di servizio dei provider di contenuti.
