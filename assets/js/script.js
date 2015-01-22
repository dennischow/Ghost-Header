// Global Variables
var debugMode = false;

// Window Variables
var windowHeight, 
    windowWidth, 
    windowScrollTop, 
    windowScrollBottom,  
    windowScrollDiff,  
    documentHeight, 
    windowScrollLast;


// Window Data Updates
function windowDateUpdates(){
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    windowScrollTop = $(window).scrollTop();
    windowScrollBottom = windowScrollTop + windowHeight;
    windowScrollDiff = windowScrollLast - windowScrollTop;
    documentHeight = $(document).height();
    if(debugMode) console.log("windowDateUpdates()" + " - W : " + windowWidth + " -  H : " + windowHeight + " - T : " + windowScrollTop + " - B : " + windowScrollBottom );
}

$(document).on('ready',function(e){
    windowDateUpdates();
    ghostHeader.init();
});

$(window).on('scroll',function(e){
    windowDateUpdates();
});

/* Ghost Header Object Function */
var ghostHeader = {
    root : null,
    offet : null,
    bottomFlashFound : null,
    debug : true,  // true | false
    offetEnable : true, // true | false
    bottomSnapNav : true,  // true | false
    shadow : true,
    init : function(){
        ghostHeader.root = $('.ghost-header');
        ghostHeader.dependency();
        ghostHeader.adjust();
        ghostHeader.track();
        ghostHeader.initialized();
    },
    initialized : function(){
        ghostHeader.root.addClass('ghost-header-initialized');
    },
    bottomFlashOn : function(){
        $('.bottom-snap-flash').addClass('bottom-snap-flash-on');
        $('#main-container').addClass('earthquake');
    },
    bottomFlashOff : function(){
        $('.bottom-snap-flash').removeClass('bottom-snap-flash-on');
        $('#main-container').removeClass('earthquake');
    },
    onScreen : function(){
        ghostHeader.root.removeClass('ghost-header-off-screen').removeAttr('aria-hidden');
    },
    offScreen : function(){
        ghostHeader.root.addClass('ghost-header-off-screen').attr('aria-hidden' , true);
    },
    dependency : function(){
        if( ghostHeader.offetEnable ){
            ghostHeader.offet = ghostHeader.root.height();
        }else{
            ghostHeader.offet = 0;
        }

        if( $('.bottom-snap-flash').length > 0 ){
            ghostHeader.bottomFlashFound = true;
        }
    },
    adjust : function(){

        if( windowScrollTop <= 0 + ghostHeader.offet ){ // Reached Top

            ghostHeader.onScreen();
            if( ghostHeader.debug ) console.log('Reached Top');

        }else if( windowScrollDiff > 0 && ghostHeader.root.hasClass('ghost-header-off-screen') ){ // Scrolling Up

            ghostHeader.onScreen();
            if( ghostHeader.debug ) console.log('Scrolling Up');

        }else if( windowScrollDiff < 0 ){ // Scrolling Down, if <= 0 may solve backhistory nav shown issue

            // Checking if reached the bottom
            if( windowScrollTop + windowHeight >= documentHeight && ghostHeader.root.hasClass('ghost-header-off-screen') ){

                // When Finished Scroll + 500ms
                if( ghostHeader.debug ) console.log('Reached Bottom - Execute in 300ms');
                if( ghostHeader.bottomFlashFound ) ghostHeader.bottomFlashOn(); // Flash

                // Fire until scrolling finish
                if( this.diffTrack ) clearTimeout( this.diffTrack );
                this.diffTrack = setTimeout(function(e){
                    if( ghostHeader.debug ) console.log('Executed');
                    if( ghostHeader.bottomSnapNav ) ghostHeader.onScreen();
                    if( ghostHeader.bottomFlashFound ) ghostHeader.bottomFlashOff(); // Flash
                }, 300 );

            }else{
                
                ghostHeader.offScreen();
                if( ghostHeader.debug ) console.log('Scrolling Down');

            }

        }
        
        // Keep track and update the final scrolled number
        windowScrollLast = windowScrollTop;

    },
    track : function(){
        $(window).on('scroll',function(e){
            ghostHeader.adjust();
        });
    }

}