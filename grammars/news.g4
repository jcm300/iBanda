grammar news;

newspaper: 'NEWS' news+
		 ;

news: titles topics body date authors
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

author: TEXTO
	  ;

/* Definição do Analisador Léxico */         
TEXTO: (('\'') ~('\'')* ('\''));

fragment DIGITO: [0-9];

DATA: DIGITO{4}'-'DIGITO{2}'-'DIGITO{2};

Separador: ( '\r'? '\n' | ' ' | '\t' )+  -> skip; 