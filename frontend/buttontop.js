let mybutton = document.getElementById("myBtn");

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    const windowHeight = window.innerHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

    if (scrollTop > (windowHeight * 2 / 3)) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
}
