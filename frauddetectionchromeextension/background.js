  chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: '#3aa757'}, function() {
      console.log('The color is green.');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });
  
  chrome.runtime.onMessage.addListener(function (response,sender,sendresponse) {
    alert(response);
/*
    var xhttp = new XMLHttpRequest();
xhttp.open("POST","http://localhost/dashboard/iwplab/j-comp/receive.php",true);

xhttp.send("fname=Henry&lname=Ford");
alert("Sent data");
*/
  });