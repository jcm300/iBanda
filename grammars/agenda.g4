grammar agenda;

agenda returns [var val, var errors]
@init {
     $val = []
     $errors = []
}   
     : 'AGENDA:' (
		event {
 				if($event.error!="") $errors.push($event.error);
				else $val.push($event.val);
               } ';'
	)+;

event returns[var val, var error]
@init {
     var existsDesc = false
     var existsLocal = false
}
	: title (desc {existsDesc=true})? (local {existsLocal=true})? time 
     {    
          if($time.ts.sdate>$time.te.edate){
               $val = ""
               $error = "Start date after end date on "+$title.val+" event!"
          }else{
               if ($time.ts.sdate==$time.te.edate && $time.ts.shour>$time.te.ehour ){
                    $val = ""
                    $error = "Start hour after end hour on "+$title.val+" event!"     
               }else {
                    $val = {
                         title: $title.val,
                         startDate: $time.ts.sdate,
                         startHour: $time.ts.shour,
                         endDate: $time.te.edate,
                         endHour: $time.te.ehour
                    }
                    if (existsDesc) $val.desc = $desc.val
                    else $val.desc = ""
                    if (existsLocal) $val.local = $local.val
                    else $val.local = ""
                    $error = ""
               }
          }
     }
     ;

title returns[var val]
     : 'TITLE:' TEXT {$val = $TEXT.text.substring(1, $TEXT.text.length-1)};

desc returns[var val]
	: 'DESC:' TEXT {$val = $TEXT.text.substring(1, $TEXT.text.length-1)};

local returns[var val]
	: 'LOCAL:' TEXT {$val = $TEXT.text.substring(1, $TEXT.text.length-1)};

time returns[var ts, var te]
     : s = start e = end 
     {
          $ts = {
               sdate: $s.sd,
               shour: $s.sh
          }
          $te = {
               edate: $e.ed,
               ehour: $e.eh
          }
     };

start returns[var sd, var sh]
	: 'BEGINS:' d = startDate h = startHour 
     {
          $sd = $d.val
          $sh = $h.val
     };

end returns[var ed, var eh]
	: 'ENDS:' d = endDate h = endHour 
     {
          $ed = $d.val
          $eh = $h.val
     };

startDate returns[var val]: DATE {$val = $DATE.text};

startHour returns[var val]: HOUR {$val = $HOUR.text};

endDate returns[var val]: DATE {$val = $DATE.text};

endHour returns[var val]: HOUR {$val = $HOUR.text};

/* Definição do Analisador Léxico */
TEXT: (['"] ~(['"])* ['"]);

fragment DIGIT: [0-9];

DATE: DIGIT DIGIT DIGIT DIGIT '-' DIGIT DIGIT '-' DIGIT DIGIT;

HOUR: DIGIT DIGIT ':' DIGIT DIGIT;

Separator: ( '\r'? '\n' | ' ' | '\t')+ -> skip; 