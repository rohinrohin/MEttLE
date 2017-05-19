// Inject Navbar HTML
document.getElementById('nav-menu').innerHTML =
  '<div class="container-fluid nav-menu-item">'+
    '<div class="navbar-header">'+
      '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">'+
        '<span class="icon-bar"></span>'+
        '<span class="icon-bar"></span>'+
        '<span class="icon-bar"></span>'+
      '</button>'+
    '</div>'+
    '<div class="collapse navbar-collapse navbar-item" id="myNavbar">'+
      '<ul class="nav navbar-nav navigation">'+
        '<li id="nav-menu-item-home"><a href="index.html">Home</a></li>'+
        '<li id="nav-menu-item-research"><a href="Research.html">Research</a></li>'+
        '<li id="nav-menu-item-tools"><a href="Tools.html">Tools</a></li>'+
        '<li id="nav-menu-item-training" class="dropdown">'+
          '<a class="dropdown-toggle" data-toggle="dropdown" href="#">Training <span class="caret"></span></a>'+
          '<ul class="dropdown-menu">'+
            '<li><a href="Option1.html">MEET 2K-15</a></li>'+
            '<li><a href="Option2.html">ET601TX</a></li>'+
            '<li><a href="Option3.html">Option 3</a></li>'+
          '</ul>'+
        '</li>'+
        '<li id="nav-menu-item-resourceslibrary"><a href="Resourceslibrary.html">Resources Library</a></li>'+
        '<li id="nav-menu-item-people"><a href="People.html">People</a></li>'+
        '<li id="nav-menu-item-publication"><a href="Publication.html">Publication</a></li>'+
        '<li id="nav-menu-item-contact"><a href="Contact.html">Contact</a></li>'+
      '</ul>'+
    '</div>'+
  '</div>';
