

function get_dingus_worker( api_url, api_params, handle_html )
{
  var api_params_str = $.param( api_params );
  api_params_str += '&callback=?'  // NB: add callback for jquery jsonp; NB: need to append as string to avoid encoding of =?

  $.getJSON( api_url, api_params_str, function( data ) {
    handle_html( data.html );    // NB: assumes response { 'html': 'markup here' }
  });
}

function process_markdown_ruby( text, handle_html )
{
  var api_params = {
    text: text
  }
  var api_url = 'http://hypertext.herokuapp.com/markdown/dingus';
 
  get_dingus_worker( api_url, api_params, handle_html );
}


function process_markdown_pandoc( text, handle_html )
{
  // NB: note jsonp enabled - no cross domain request possible; use proxy server or similar
  //   todo: find other service
  var api_params = {
    text: text,
    url: 'http://johnmacfarlane.net/cgi-bin/pandoc-dingus'
  }
   
  var api_url = 'http://hypertext.herokuapp.com/proxy'

  get_dingus_worker( api_url, api_params, handle_html );
}



var markdown_notepad_new = function( opts ) {
    
    // use module pattern (see JavaScript - The Good Parts)

    var engines = [
      {
         name:    'Standard',
         markdown: process_markdown_ruby
      }
    ];

    var settings;  // NB: defaults + opts merged => settings
    
    var defaults = {
     output:        '#output',
     output_source: '#output-source',
     output_toggle: {
       id: '#output-toggle',
       label_show: '[ Show HTML ]',
       label_hide: '[ Hide HTML ]' },
     output_update: '#output-update',

     input:         '#notepad',
     input_lib:     '#notepad-lib'
    }


    function _debug( msg )
    {
       // console.log( "[debug] " + msg );
    }

    var $output,
        $output_source,
        $output_toggle,
        $output_update,
        $input,
        $input_lib;


    var show_html = false;


    function _toggle_output()
    {
      show_html = !show_html;
    
      if( show_html ) {
        $output_toggle.html( settings.output_toggle.label_hide );
        $output.hide();
        $output_source.show();
      }
      else {
        $output_toggle.html( settings.output_toggle.label_show );
        $output.show();
        $output_source.hide();
      }
    }


    function _update_output()
    {
      var text = $input.val();  // get markdown text

      var engine = engines[0];

      engine.markdown( text, function( html ) {
         $output.html( html );
         $output_source.html( html );
      });
    }


   function _init( opts )
   {
     settings = $.extend( {}, defaults, opts );


     $output        = $( settings.output );
     $output_source = $( settings.output_source );
     $output_update = $( settings.output_update );
     $output_toggle = $( settings.output_toggle.id );

     $input         = $( settings.input );

     $output_update.click( function() { _update_output(); } );
     $output_toggle.click( function() { _toggle_output(); } );
   }

   _init( opts );
   
    return {
      update: _update_output,
      toggle: _toggle_output
    }
} // fn markdown_notepad_new
