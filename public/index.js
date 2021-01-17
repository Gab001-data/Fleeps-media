$(".tags").click(function(){
    const x= $("#tag-items");
    if(x.css("display")==="none"){
        x.css("display","block");

    }else {
        x.css("display","none");
    }
        //$("#arrow").toggle(".rotate-arrow");
        //console.log($("#tag-items").html());
});
// navigation dropdown function
function myFunction(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else { 
      x.className = x.className.replace(" w3-show", "");
    }
  }
//add likes to comments
function showLikes(evt){
    let x= evt.currentTarget;
    let val= x.innerHTML;
    let total= Number(val)+1;
    x.innerHTML=total;
    x.css("display","inline-block");
}
//show/hide elements
function showElements(id){
    const x= $("#"+id);
    if(x.css("display")==="none"){
        x.css("display","block");

    }else {
        x.css("display","none");
    }
}

let index=0;
let slideIndex=0;
carousel();
carousel2();
function showItem(id){
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

function carousel(){
    let classList1= document.querySelectorAll(".trend-titles");
    for(let i=0; i<classList1.length; i++){
        classList1[i].style.display="none";
    }
    if (index > classList1.length-1) {index = 0}
    classList1[index].style.display="inline-block";
    index++;
    setTimeout(carousel, 4000);
}
function carousel2(){
    var i;
    var x = document.getElementsByClassName("hero-slides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > x.length) {slideIndex = 1}
    x[slideIndex-1].style.display = "block";
    setTimeout(carousel2, 6000); // Change image every 2 seconds
}
function showTab(evt,id){
    let x=$(".tabs");
    let y=$("#"+id);
    let tabs= $(".tab-head");
    for(let i=0; i<x.length; i++){
        x[i].style.display="none";
        
    }
    for(let j=0; j<tabs.length; j++){
        tabs[j].className= tabs[j].className.replace(" add-background", "");
    }
    y.css("display","block");
    evt.currentTarget.className+= " add-background";
    
}