var pagetop, menu, heading, ypos;
  var isNavTop=0;
    function yscroll(){
      pagetop = document.getElementById('header-area');
      menu = document.getElementById('menu-header');
      // heading = document.getElementById('title-heading');
      ypos = window.pageYOffset;

        if(ypos > 20 && isNavTop==0){
          pagetop.style.display = "none";
          // menu.style.position = "relative";
          // menu.style.top = "0";
          menu.style.position = "fixed";
          pagetop.style.position = "fixed";
          // menu.style.z-index = 99;
          isNavTop=1;
        }
        if(isNavTop==1 && ypos < 20){
          pagetop.style.display = "block";
                    menu.style.position = "static";
          pagetop.style.position = "static";
          isNavTop=0;

          // men.style.position = "static";
          // menu.style.position = "absolute";
          // menu.style.background = "#000";
          // menu.style.position = "fixed";
          // var ht;
          // // ht = document.getElementById('header-area').height();
          // // alert(ht);
          // menu.style.top = "100px";
          
        }
  }
    window.addEventListener('scroll',yscroll);