var el = {};
el.overlay = $('#main-loading-box');
el.loadingbox = $('#loadingbox');
el.arrowup = $('#arrowup');
el.arrowdown = $('#arrowdown');
el.menuslide = $('#menuslide');
el.topheader = $('#topheader');
el.topnavigation = $('#topnavigation');


/* === Low-Level Fn's === */
function _toggle_visible(source_element, target_element) // fade/hide source, unfade/show target (two el's on top of each other, usually)
{
    $(target_element).css({opacity: 0}).hide().addClass('hidden');
    $(source_element).animate({opacity: 0}, function () {

        $(source_element).hide().addClass('hidden');
        $(target_element).show().removeClass('hidden').animate({opacity: 1});

    });
}


/* === Loading Spinner Control === */
var queued_tasks = 0;
function _trigger_loading() // trigger the loading spinner to show, and increment our task count
{
    queued_tasks++;
    if ($(el.loadingbox).hasClass('hidden'))
    {
        $(el.loadingbox).css({opacity: 0}).removeClass('hidden').animate({opacity: 1});
    }
}

function _trigger_done() // notify the main thread that a task has finished, but only disable the spinner if all are done
{
    queued_tasks--;
    if (queued_tasks === 0)
    {
        $(el.loadingbox).animate({opacity: 0}, function () {
            $(el.loadingbox).addClass('hidden');
        });
    }
}


/* === Compact Nav Control === */
function toggleNavVisible() // toggle the compact navigation open/closed
{
    var st = {};

    if($(el.menuslide).attr('data-state') == 'closed')
    {
        // define state
        st.current_arrow = el.arrowdown;
        st.target_arrow = el.arrowup;
        st.target_state = 'open';

        // animate header
        $(el.topnavigation).css({height: 0, opacity: 0}).removeClass('hidden').animate({opacity: 1.0, height: 225});
    }
    else
    {
        // define state
        st.current_arrow = el.arrowup;
        st.target_arrow = el.arrowdown;
        st.target_state = 'closed';

        //animate header
        $(el.topnavigation).animate({height: 0, opacity: 0}, function () {
            $(el.topnavigation).css({height: 0, opacity: 1});
        });
    }

    _toggle_visible(st.current_arrow, st.target_arrow);
    $(el.menuslide).attr('data-state', st.target_state);
}


/* === Loading Overlay Control === */
function _hide_overlay() {
    $(el.overlay).animate({opacity: 0}, function () {
        $(el.overlay).addClass('hidden');
    });
}

function _show_overlay() {
    $(el.overlay).css({opacity: 0}).removeClass('hidden').animate({opacity: 1});
}



// Export utils
window.utils =  {

    toggle_visible: _toggle_visible,
    trigger_loading: _trigger_loading,
    trigger_done: _trigger_done,
    toggle_nav_visibile: toggleNavVisible,
    hide_overlay: _hide_overlay,
    show_overlay: _show_overlay,
    elementRegistry: el

};
