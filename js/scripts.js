(function( window, document, $, Modernizr ){
var isIOS = !!('createTouch' in document);
var transformProp = Modernizr.prefixed('transform');

function EmmFunction () {
  this.scrolled = 0;
  this.currentLevel = 0;
  this.levels = 7;
  this.distance3d = 1000;
  this.levelGuide = {
    '#intro' : 0,
    '#apresentacao' : 1,
    '#stacks' : 2,
    '#servicos' : 3,
    '#projetos' : 4
  };
  
  this.$window = $(window);
  this.$document = $(document);
  this.getScrollTransform = Modernizr.csstransforms3d ? 
  this.getScroll3DTransform : this.getScroll2DTransform;
  if ( Modernizr.csstransforms ) {
    window.addEventListener( 'scroll', this, false);
  }
}

EmmFunction .prototype.handleEvent = function( event ) {
  if ( this[event.type] ) {
    this[event.type](event);
  }
};

EmmFunction .prototype.getScroll2DTransform = function( scroll ) {
  var scale = Math.pow( 3, scroll * (this.levels - 1) );
  return 'scale(' + scale + ')';
};

EmmFunction .prototype.getScroll3DTransform = function( scroll ) {
  var z = ( scroll * (this.levels - 1) * this.distance3d ),      
      leveledZ = this.distance3d / 2 - Math.abs( ( z % this.distance3d ) - this.distance3d / 2 ),
      style;
  if ( leveledZ < 5 ) {
    z = Math.round( z / this.distance3d ) * this.distance3d;
  }
  
  return 'translate3d( 0, 0, ' + z + 'px )';
};

EmmFunction .prototype.scroll = function( event ) {
  this.scrolled = this.$window.scrollTop() / ( this.$document.height() - this.$window.height() );

  this.transformScroll( this.scrolled );

  this.currentLevel = Math.round( this.scrolled * (this.levels-1) );
  
  if ( this.currentLevel !== this.previousLevel && this.$nav ) {
    this.$nav.find('.current').removeClass('current');
    if ( this.currentLevel < 5 ) {
      this.$nav.children().eq( this.currentLevel ).addClass('current');
    }
    this.previousLevel = this.currentLevel;
  }
  
};
 
EmmFunction .prototype.transformScroll = function( scroll ) { 
  if ( !this.$content ) {
    return;
  }

  var style = {};
  style[ transformProp ] = this.getScrollTransform( scroll );
  this.$content.css( style );
};

EmmFunction .prototype.click = function( event ) { 
  var hash = event.target.hash || event.target.parentNode.hash,
      targetLevel = this.levelGuide[ hash ],
      scroll = targetLevel / (this.levels-1);

  if ( Modernizr.csstransitions ) {
    this.$content.addClass('transitions-on');
    this.$content[0].addEventListener( 'webkitTransitionEnd', this, false );
    this.$content[0].addEventListener( 'oTransitionEnd', this, false );
    this.$content[0].addEventListener( 'transitionend', this, false );
  }
  
  this.$window.scrollTop( scroll * ( this.$document.height() - this.$window.height() ) );

  if ( isIOS ) {
    this.transformScroll( scroll );
  }

  event.preventDefault();
  
};


EmmFunction .prototype.webkitTransitionEnd = function( event ) {
  this.transitionEnded( event );
};

EmmFunction .prototype.transitionend = function( event ) {
  this.transitionEnded( event );
};

EmmFunction .prototype.oTransitionEnd = function( event ) {
  this.transitionEnded( event );
};

EmmFunction .prototype.transitionEnded = function( event ) {
  this.$content.removeClass('transitions-on');
  this.$content[0].removeEventListener( 'webkitTransitionEnd', this, false );
  this.$content[0].removeEventListener( 'transitionend', this, false );
  this.$content[0].removeEventListener( 'oTransitionEnd', this, false );
};


$(function(){
  var BCXI = new EmmFunction ();

  BCXI.$content = $('#content');
  BCXI.$nav = $('#nav');

  var $body = $('body'),
      iOSclass = isIOS ? 'ios' : 'no-ios';

  $body.addClass( iOSclass );

  if ( Modernizr.csstransforms ) {
    $('.page-nav').each(function(){
      this.addEventListener( 'click', BCXI, false );
    });
  }
    
  $('#totem').click(function(){
    var $audio = $('<audio />', { 
      autoPlay : 'autoplay'
    });

    $('<source>', {
      src : 'audio/inception.mp3'
    }).appendTo( $audio );

    $('<source>', {
      src : 'audio/inception.ogg'
    }).appendTo( $audio );

    $body.append( $audio );
    setTimeout( function( $audio ){
      $audio.remove();
    }, 4000, $audio );

    $('#intro h1').addClass('beerception').text('Emmanuel');
    $('#intro .blurb').text('Full-Stack Developer');
  });
  
});


})( window, window.document, window.jQuery, window.Modernizr );