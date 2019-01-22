grammar agenda;

agenda: 'AGENDA' event+
      ;

event: title desc local time 

title: 'TITLE:' TEXTO

desc: 'DESC:' TEXTO

local: 'LOCAL:' TEXTO

time: start end 
     ;

start: 'BEGINS:' startDate startHour
     ;

end: 'ENDS:' endDate endHour
   ;

startDate: DATA
		 ;

startHour: HORAS 
		 ;

endDate: DATA
       ;

endHour: HORAS
	   ;



/* Definição do Analisador Léxico */         
TEXTO: (('\'') ~('\'')* ('\''));

fragment LETRA : [a-zA-ZáéíóúÁÉÍÓÚÃãÕõâêôÂÊÔÀÈÌÒÙàèìòùÇç] ;

fragment DIGITO: [0-9];

fragment SIMBOLO : [-%$€@&()\[\]:{}=><+*;,ºª~^/\'"];

PALAVRA: (LETRA | DIGITO | SIMBOLO)+;

DATA: DIGITO{1,2}'-'DIGITO{1,2}'-'DIGITO{4}

HORAS: DIGITO{2}:DIGITO{2}

Separador: ( '\r'? '\n' | ' ' | '\t' )+  -> skip; 