/* sideBar js */
$('.sidebar-toggle').click(function () {
  $('body').toggleClass('collapse-warp')
})

$('.sidebar-menu>li:not(:first)').click(function () {
  $(this).addClass('active').siblings().removeClass('active')
})
