

var markdown_notepad_new = function( opts ) {

    // use module pattern (see JavaScript - The Good Parts)

    var engines = [
      { name:    'Standard (Offline)', markdown: markdown_libs.showdown },
      { name:    'Standard (Online)',  markdown: markdown_apis.ruby  },
      { name:    'JavaScript - Showdown (Offline)', markdown: markdown_libs.showdown },
      { name:    'JavaScript - pagedown (Offline)', markdown: markdown_libs.pagedown },
      { name:    'Ruby - kramdown (Online)',  markdown: markdown_apis.ruby_kramdown },
      { name:    'Ruby - Redcarpet (Online)', markdown: markdown_apis.ruby_redcarpet },
      { name:    'Ruby - Maruku (Online)',    markdown: markdown_apis.ruby_maruku },
      { name:    'Ruby - BlueCloth (Online)', markdown: markdown_apis.ruby_bluecloth }
    ];

    var welcome = {
        markdown: "Welcome to Markdown. We hope you **really** enjoy using this."+
      "\n\n"+
      "Just type some [markdown](http://daringfireball.net/projects/markdown) on the left and see it on the right. *Simple as that.*",
        html:     "<p>Welcome to Markdown</a>. We hope you <strong>really</strong> enjoy using this.</p>" +
                  "<p>Just type some <a href='http://daringfireball.net/projects/markdown'>markdown</a> on the left and see it on the right. <em>Simple as that.</em></p>"
      }


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
     input_lib:     '#notepad-lib',

     input_toggle: {
       id: '#input-toggle',
       label_black: '[ Use Black Color Theme]',
       label_white: '[ Use White Color Theme]'
     },

     engines:  engines,
     
     welcome:  welcome
    }


    function _debug( msg )
    {
      if(window.console && window.console.log )
        window.console.log( "[debug] " + msg );
    }

    var $output,
        $output_source,
        $output_toggle,
        $output_update,
        $input,
        $input_lib,
        $input_toggle;


    var show_html = false;
    var use_white_color_theme = false;

    function toggle_output()
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


    function _toggle_color_theme()
    {
   /**
     *  todo: move to addon?? out of "core"
     */
 
      use_white_color_theme = !use_white_color_theme;
      if( use_white_color_theme ) {
        $input.removeClass( 'black' );
        $input_toggle.html( settings.input_toggle.label_black );
      }
      else {
        $input.addClass( 'black' );
        $input_toggle.html( settings.input_toggle.label_white );
      }
    }


    function update_output()
    {
      var text = $input.val();  // get markdown text
      var engine_index = parseInt( $input_lib.val(), 10);

      var engine = settings.engines[engine_index];

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
     $input_lib     = $( settings.input_lib );

     $input_toggle  = $( settings.input_toggle.id );

     $input.val( settings.welcome.markdown );

     $output.html( settings.welcome.html );
     $output_source.html( settings.welcome.html );


     $output_update.click( function() { update_output(); } );
     $output_toggle.click( function() { toggle_output(); } );

     $input_toggle.click( function() { _toggle_color_theme(); } );
     
     // add markdown engine/lib options
     var markdown_opts = '';
     $.each( engines, function(index, engine) {
        markdown_opts += '<option value="' + index + '"';
        if( index == 0 ) {
          markdown_opts += 'selected="selected"'
        }
        markdown_opts += '>' + engine.name + '</option>';
        
        _debug( 'add markdown engine [' + index + ']: ' + engine.name );
     });
     $input_lib.html( markdown_opts );
   }

   _init( opts );
   
    return {
      update: update_output,
      toggle: toggle_output
    }
} // fn markdown_notepad_new
