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
let click=0;
let currentTarget;
let numClicks={}; 
function showLikes(id,evt){
    let x= document.getElementById(id);
    let val= x.innerHTML;
    let total;
    let commentId=evt.target.dataset.postId;
    let replyId=evt.target.dataset.replyId;
    if(commentId){
      if (numClicks[commentId]){
      numClicks[commentId]+=1;
      }else{
        numClicks[commentId]=1;

      }
    }else{
      if (numClicks[replyId]){
      numClicks[replyId]+=1;
      }else{
        numClicks[replyId]=1;

      }
    }
    if(numClicks[commentId]===1 || numClicks[replyId]===1){
      total= Number(val)+1;
      commentId? axios.post('/comment/' + commentId + '/like', { total: total }):axios.post('/reply/' + replyId + '/like', { total: total });
    }else {
      total= Number(val)-1;
      commentId? axios.post('/comment/' + commentId + '/unLike', { total: total }):axios.post('/reply/' + replyId + '/unlike', { total: total });
      
      commentId? numClicks[commentId]="": numClicks[replyId]=""; 
       
    }
    x.innerHTML=total;
    // if(evt.currentTarget.className.indexOf('like-color')>0){
    //     evt.currentTarget.className= evt.currentTarget.className.remove('like-color');
    // }else{
    //     evt.currentTarget.className+=' like-color';
    // }
      
}
//Alternative to the showLikes function
let numClicks1={}; 
function showLikes2(id,evt){
    let x= document.getElementById(id);
    let val= x.innerHTML;
    let total;
    if (numClicks1[id]){
        numClicks1[id]+=1;
    }else{
        numClicks1[id]=1;
    }
    if(numClicks1[id]===1){
        total= Number(val)+1;
        axios.post('/' + id + '/like', { total: total });
      }else {
        total= Number(val)-1;
        axios.post('/' + id + '/unLike', { total: total });
        numClicks1[id]=""; 
      }
      x.innerHTML=total; 
    if(evt.currentTarget.className.indexOf('likes-color')>0){
        evt.currentTarget.className= evt.currentTarget.className.replace(' likes-color',"");
        x.className=x.className.replace(' likes-color',"");
    
    }else{
        evt.currentTarget.className+=' likes-color';
        x.className+=' likes-color';
        
    }
}
// subscribing clients to pusher channel published from the server

var pusher = new Pusher('6fca6f9791db894ce806', {
    cluster: 'mt1'
});
var socketId;

// retrieve the socket ID on successful connection
pusher.connection.bind('connected', function() {
    socketId = pusher.connection.socket_id;
});


var channel = pusher.subscribe('post-events');
channel.bind('postAction', function(data) {
    // log message data to console - for debugging purposes
    showLikes2(data.typeId);
});

//Report comments as abusive and disinformation
function reportComment(id,evt){
    let reportText= (evt.currentTarget.innerHTML).split(" ");
    reportText=reportText[reportText.length-1];
    axios.post('/report/' + id + '/' + reportText);
    $('#id01').css("display","block");
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