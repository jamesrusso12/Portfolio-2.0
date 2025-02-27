function rotate(sID,aWords, iIndex){
  $("#"+sID).html(aWords[iIndex]).fadeIn(1000, function() {	
    iIndex==(aWords.length-1)? iIndex=0:iIndex++;			
    $("#"+sID).fadeOut(1000, function() {					
      rotate(sID,aWords,iIndex);							
    }); 
  });
}



rotate("test1",["Game Developer", "Web Designer", "Software Architect"], 0);
