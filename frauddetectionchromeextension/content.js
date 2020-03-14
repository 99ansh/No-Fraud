if(window.location.host=="www.amazon.in"){
    //collect data from amazon
    var lati;
    var longi;
    var total_amt;
    function showPosition(position){
        //alert(position.coords.latitude);
        //#alert(position.timestamp);
        lati = position.coords.latitude;
        longi = position.coords.longitude;
        alert(lati);
        alert(longi);

        localStorage.setItem("lati",lati.toString());
        localStorage.setItem("longi",longi);
    }
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    var amt = document.getElementsByClassName("a-size-medium a-color-price sc-price sc-white-space-nowrap  sc-price-sign")[0];
    if(amt!=null){
        alert(amt.textContent);
        total_amt=amt.textContent;
        localStorage.setItem("total_amt",total_amt);
    }

    //imp_btn is on amazon
    var proceed = document.getElementsByName("proceedToCheckout")[0];
    if(proceed!=null){
        lati=localStorage.getItem("lati");
        longi=localStorage.getItem("longi");
        total_amt=localStorage.getItem("total_amt");
        var obj = JSON.stringify({"latitude":lati,"longitude":longi,"amount":total_amt});
            var xhr = new XMLHttpRequest();
            xhr.open("POST","http://localhost:5000/receive_data_verification",false);
            xhr.setRequestHeader("Content-type","application/json");
            xhr.onreadystatechange = function(){
            if (xhr.readyState==4){
                console.log("logging xhr response from py: "+xhr.response);
            }
            var myjson = JSON.parse(xhr.responseText);
            alert(xhr.response);
            //alert(myjson["code"]);
            };
            xhr.send(obj);
            
            setTimeout(function(){}, 3000);
            
            proceed.addEventListener("mouseenter",function(){
            window.open("http://localhost:5000/verification","_self");
        });
    }

}
else{
    //on coming to verification.html set values
    var body = document.getElementById("verification");
    if (body!=null){
        alert(body);
        body.addEventListener("load",function(){

            document.getElementById("latitude").value=localStorage.getItem("lati");
            //document.getElementById("longitude").value=longi;
            //document.getElementById("amount").value=total_amt;
        });

        //btn is on verification.html
        var btn = document.getElementById("predict_btn");
        if (btn!=null){
            btn.addEventListener("click",
            function(){
                var cardnumber = document.getElementById('cardnumber').value;
                var cvv = document.getElementById('cvv').value;
                var latitude = document.getElementById('latitude').value;
                var longitude = document.getElementById('longitude').value;
                var amount = document.getElementById('amount').value;
                var obj = JSON.stringify({"cardnumber":cardnumber,"cvv":cvv,"latitude":latitude,"longitude":longitude,"amount":amount});
                var xhr = new XMLHttpRequest();
                xhr.open("POST","http://localhost:5000/predict",false);
                xhr.setRequestHeader("Content-type","application/json");
                xhr.onreadystatechange = function(){
                if (xhr.readyState==4){
                    console.log("logging xhr response from py: "+xhr.response);
                }
                var myjson = JSON.parse(xhr.responseText);
                alert(xhr.response);
                };
                xhr.send(obj);
            });
        }
    }

    var body2 = document.getElementById("registration");
    if (body2!=null){
        alert(body2);
        body2.addEventListener("load",function(){

            document.getElementById("latitude").value=localStorage.getItem("lati");
            //document.getElementById("longitude").value=longi;
            //document.getElementById("amount").value=total_amt;
        });

        //btn is on verification.html
        var btn = document.getElementById("proceed-btn");
        if (btn!=null){
            btn.addEventListener("click",
            function(){
                var cardnumber = document.getElementById('cardnumber').value;
                var cvv = document.getElementById('cvv').value;
                var month = document.getElementsByName('Month')[0].value;
                var year = document.getElementsByName('Year')[0].value;
                month.onchange = function(){
                    month = month.value;
                };
                year.onchange = function(){
                    year = year.value;
                };
                
                var obj = JSON.stringify({"cardnumber":cardnumber,"cvv":cvv,"month":month,"year":year});
                var xhr = new XMLHttpRequest();
                xhr.open("POST","http://localhost:5000/receive_data_registration",false);
                xhr.setRequestHeader("Content-type","application/json");
                xhr.onreadystatechange = function(){
                if (xhr.readyState==4){
                    console.log("logging xhr response from py: "+xhr.response);
                }
                var myjson = JSON.parse(xhr.responseText);
                alert(xhr.response);
                window.open("https://www.amazon.in",'_self');
                //alert(myjson["code"]);
                };
                xhr.send(obj);
            });
        }
    }
}

/*
var btn = document.getElementById("btn-post");
alert(btn.textContent);

btn.addEventListener("click",
function(){
    var name = "Ansh";
//var obj = JSON.stringify({"cardnumber":cardnumber,"name":name,"expirymonth":expirymonth,"expiryyear":expiryyear,"cvv":cvv,"latitude":latitude,"longitude":longitude,"email":email,"mobile":mobile});
var obj = JSON.stringify({"myname":name});
var xhr = new XMLHttpRequest();
xhr.open("POST","http://localhost:5000/trial",false);
xhr.setRequestHeader("Content-type","application/json");
xhr.onreadystatechange = function(){
    if (xhr.readyState==4){
        console.log("logging xhr response from py: "+xhr.response);
    }
    var myjson = JSON.parse(xhr.responseText);
    alert(xhr.response);
    alert(myjson["code"]);

    // if(myjson["code"]=="1"){
    //     alert("user doesnot exist");
    //     var email = prompt("Enter email");
    //     var mobile = prompt("Enter mobile");
    //     var obj = JSON.stringify({"cardnumber":cardnumber,"name":name,"expirymonth":expirymonth,"expiryyear":expiryyear,"cvv":cvv,"latitude":latitude,"longitude":longitude,"email":email,"mobile":mobile});
    //     //xhr.send(obj);
    //     var xhr2 = new XMLHttpRequest();
    //     xhr2.open("POST","http://localhost:5000/newuser",false);
    //     xhr2.setRequestHeader("Content-type","application/json");
    //     xhr2.onreadystatechange = function(){
    //     if (xhr2.readyState==4){
    //         console.log("xhr2 response: "+xhr2.response);
    //     }
    //     //myjson = JSON.parse(xhr2.responseText);
    //     alert(xhr2.response);
    //     };
    //     xhr2.send(obj)
    // }
    
};
xhr.send(obj);
});
*/