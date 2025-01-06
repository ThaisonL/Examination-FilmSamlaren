# Examination-FilmSamlaren

Detta är en webbsida som man kan söka på filmer samt serier som använder ombd api för att hämta information om filmer och serier. Användaren kan även klicka på olika flimer och serier för att få ytterligare information i ett fönster.

Klona repot från github https://github.com/ThaisonL/Examination-FilmSamlaren

skriv npm start i terminalen för att starta hemsidan lokalt

Länk till figma: https://www.figma.com/design/y3dKnnVPQAIkTByQnzTWEX/Untitled?node-id=0-1&p=f&t=rGPdl4G6JwlCimxj-0

Jag har hämtat data i JSON-format från ombdapi via en asykron GET-förfrågan med fetch. Datan tolkas och presenteras på webbsidan där användaren kan söka på filmen.

Api endpointen jag använder är ombdbapi.com och parameterarna jag använder är "s" för att skicka en sökförfrågan på en film och "i" för att hämta detaljerna om en specifik film på imbd.

Användaren kan navigera genom att skriva in ett sökord i en sökruta där det kommer antigen visa film/serier eller kommer det upp en felkod att sökningen inte finns. Användaren kan sen klicka på valfri lyckad sökning för att läsa mer om filmen/serien.
