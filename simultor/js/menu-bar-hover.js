// handles hover animation of a dropdown list
$('ul.nav li.dropdown').hover(function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(0).fadeIn();
}, function() {
  $(this).find('.dropdown-menu').stop(true, true).delay(0).fadeOut();
});
