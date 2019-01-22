grammar agenda;

agenda: 'AGENDA' event+
      ;

event: title desc local time
     ;

title: 'TITLE:' TEXTO
     ;

desc: 'DESC:' TEXTO
    ;

local: 'LOCAL:' TEXTO
     ;

time: start end 
    ;

start: 'BEGINS:' startDate startHour
     ;

end: 'ENDS:' endDate endHour
   ;

startDate: DATA
	    ;

startHour: HORA 
	    ;

endDate: DATA
       ;

endHour: HORA
	  ;

/* Definição do Analisador Léxico */         
TEXTO: (('\'') ~('\'')* ('\''));

fragment DIGITO: [0-9];

DATA: DIGITO{4}'-'DIGITO{2}'-'DIGITO{2};

HORA: DIGITO{2}':'DIGITO{2};

Separador: ( '\r'? '\n' | ' ' | '\t' )+  -> skip; 