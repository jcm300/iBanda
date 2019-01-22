grammar news;

newspaper: news+

news: 'NEWS' titles topics body date authors
    ;

titles: 'TITLE:' title ('SUBTITLE:' title)?
	  ;

title: TEXTO 
	 ;

topics: 'TOPICS:' topic (',' topic)* '.'
	  ;

topic: TEXTO
	 ;

body: 'BODY:' TEXTO
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

PALAVRA: (LETRA | DIGITO | SIMBOLO)+;

DATA: DIGITO{1,2}'-'DIGITO{1,2}'-'DIGITO{4}

Separador: ( '\r'? '\n' | ' ' | '\t' )+  -> skip; 