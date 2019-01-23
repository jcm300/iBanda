grammar news;

newspaper returns [var val, var errors]
@init{
	$val = []
	$errors = []
}
		 :'NEWS:' (news {
			 if($news.error!="") $errors.push($news.error);
			 else $val.push($news.val);
		 } ';')+
		 ;

news returns [var val, var error]
@init{
	function today(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
			dd = '0' + dd;
		}

		if (mm < 10) {
			mm = '0' + mm;
		}

		today = yyyy + '-' + mm + '-' + dd;
		return today;
	}
	var existTopics = false
	var existAuthors = false
}
	: titles (topics {existTopics = true})? body date (authors {existAuthors = true})?
	{
		if(today()>=$date.val){
			$val = {
				title: $titles.titleOut,
				subtitle: $titles.subtitle,
				body: $body.val,
				date: $date.val
			}
			if(existTopics) $val.topics = $topics.val
			else $val.topics = []
			if(existAuthors) $val.authors = $authors.val
			else $val.authors = []
			$error = ""
		}else{
			$val = ""
			$error = "Date is in the future on " + $titles.titleOut + " article!"
		}
	}
    ;

titles returns [var titleOut, var subtitle]
@init{
	var subExists = false
}
		: 'TITLE:' t=title ('SUBTITLE:' s=title {subExists = true})?
		{
			$titleOut = $t.val
			if(subExists) $subtitle = $s.val
			else $subtitle = ""
		}
		;

title returns [var val]
	: TEXT {$val = $TEXT.text.substring(1, $TEXT.text.length-1)}
	;

topics returns [var val]
@init{
	$val = []
}
		: 'TOPICS:' t1=topic {$val.push($t1.val)} (',' t2=topic {$val.push($t2.val)})*
		;

topic returns [var val]
		: TEXT {$val = $TEXT.text.substring(1, $TEXT.text.length-1)}
		;

body returns [var val]
	: 'BODY:' TEXT {$val = $TEXT.text.substring(1, $TEXT.text.length-1)}
	;

date returns [var val]
	: 'DATE:' DATE {$val = $DATE.text}
	;

authors returns [var val]
@init{
	$val = []
}
		: 'AUTHORS:' a1=author {$val.push($a1.val)} (',' a2=author {$val.push($a2.val)})*
	   ;

author returns [var val]
		: TEXT {$val = $TEXT.text.substring(1, $TEXT.text.length-1)}
		;

/* Definição do Analisador Léxico */         
TEXT: (['"] ~(['"])* ['"]);

fragment DIGIT: [0-9];

DATE: DIGIT DIGIT DIGIT DIGIT '-' DIGIT DIGIT '-' DIGIT DIGIT;

Separator: ( '\r'? '\n' | ' ' | '\t' )+  -> skip; 