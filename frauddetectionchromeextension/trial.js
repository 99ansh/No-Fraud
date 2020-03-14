window.onload = function(){
var myObject = {'name':'Kasun', 'address':'columbo','age': '29'};

  var xhr = new XMLHttpRequest();
    xhr.open("POST","http://localhost/dashboard/iwplab/j-comp/receive.php",false);
    xhr.setRequestHeader("Content-type","application/json");
    xhr.setRequestHeader("Content-length",this.Object.keys(myObject).length);
    xhr.setRequestHeader("Connection","close");
    xhr.onreadystatechange = function(){
      if(xhr.readyState==4){
        console.log("xhr response:"+xhr.response);
      }
    };
    xhr.send(myObject);

    window.location.href = 'http://localhost/dashboard/iwplab/j-comp/receive.php';
};