
 var show_html = false;

 function toggle_output() {
    var $toggle_output = $( '#toggle-output' );
    var $output        = $( '#output' );
    var $output_source = $( '#output-source' );
    
    show_html = !show_html;
    
    if( show_html ) {
      $toggle_output.html( '[ Hide HTML ]' );
      $output.hide();
      $output_source.show();
    }
    else {
      $toggle_output.html( '[ Show HTML ]' );
      $output.show();
      $output_source.hide();
    }
 }

 function process_markdown() {
    var params = $( '#notepad, #notepad-lib' ).serialize();
    
    params += '&callback=?';  // add jsonp callback for jquery
    
    // window.alert( params );
    var api_link = 'http://hypertext.herokuapp.com/markdown/dingus';
    $.getJSON( api_link, params, function( data ) {
       
       var $output        = $( '#output' );
       var $output_source = $( '#output-source' );
       // window.alert( html );
       
       // todo: check if data.html present? or content type js/json
       //  allow dingus-style { 'html': 'dddddd' }
       $output.html( data.html );
       $output_source.html( data.html );
    });
 }
