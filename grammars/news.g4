grammar news;

news: 'NEWS' titles topics body date authors
    ;

titles: 'TITLE:' title ('SUBTITLE:' title)?
	  ;

title: PALAVRA+ 
	 ;

topics: 'TOPICS:' topic (',' topic)* '.'
	  ;

topic: PALAVRA+
	 ;

body: 'BODY:' PALAVRA+
	;

date: 'DATE:' DATA
	;

authors: 'AUTHORS:' author (',' author)*
	   ;



/* Definição do Analisador Léxico */         
TEXTO: (('\'') ~('\'')* ('\''));

fragment LETRA : [a-zA-ZáéíóúÁÉÍÓÚÃãÕõâêôÂÊÔÀÈÌÒÙàèìòùÇç] ;

fragment DIGITO: [0-9];

fragment SIMBOLO : [-%$€@&()\[\]:{}=><+*;,ºª~^/\'"];

PONTOTERMINAL: [?.!];

PALAVRA: (LETRA | DIGITO | SIMBOLO)+;

DATA: DIGITO{2}'-'DIGITO{2}'-'DIGITO{4}

Separador: ( '\r'? '\n' | ' ' | '\t' )+  -> skip; 