# Clashroom
Questo sito ha la funzione di organizzare alcuni eventi creati da teachers e leggibili da students.

## Struttura database
Il db 'clashroom' è composto da 4 tabelle:
- **user**: tabella utenti
- **studsub**: tabella con le iscrizioni degli utenti 'student' ai corsi
- **courses**: elenco corsi
- **events**: elenco eventi

## File uploaded
Eventuali file caricati sulla piattaforma saranno accessibili da una sezione in fondo alla pagina... potranno essere scaricati ed eliminati.

**Attenzione!**: a causa del poco tempo a disposizione ci sono alcuni problemi legati ai files; i nuovi files verranno visualizzati nell'elenco in basso soltanto sul refresh della pagina e inoltre se si eliminano i file, il riferimento nell'evento rimane e cercando di scaricarlo andrà in errore.

## Login
Ci si deve oblligatoriamente registrare con un'indirizzo email. Per facilitare la compilazione durante la registrazione è presente un bottone per accedere tramite un'account Google.
![alt text](https://github.com/abongioanni/clashroom/blob/master/src/img/screen1.png "Sign up via Google")
Se si è dimentata al password c'è un link che invia una mail all'indirizzo email inserito con un'link ad una pagina per la reimpostazione della password.

## Utenza
Ci sono due tipi di utenza:
- **Teachers**: utenti che possono creare/eliminare/visualizzare corsi ed eventi
- **Students**: utenti che possono iscriversi/disiscriversi ai corsi e visualizzarne gli eventi

## Sezione 'Add'
Se l'utente è un teacher la sezione 'Add' permette di creare un corso (inserendo il nome del corso ad esempio 'Informatica') o un evento legato ad un corso (inserendo il corso, la data dell'evento, l'argomento ed eventuali file scaricabili).
Questa sezione sarà accessibile dagli studenti per iscriversi al corso, inserendo il codice di quest'ultimo divulgabile dal teacher che ha creato quel corso.

## Sezione 'Events'
Qui si possono vedere gli eventi e scaricare (se presenti) eventuali allegati. Se si è un teacher si può anche eliminare l'evento

## Sezione 'Courses'
Qui si possono vedere i corsi. Se si è un teacher si può anche condividere con una mail il codice del corso

## Sezione 'Settings' 
In questa sezione si può cambiare la password, eliminare l'account e vedere i file caricati.

Per info contattatemi all'indirizzo **bongioanni.clashroom@gmail.com**
