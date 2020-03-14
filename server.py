from flask import Flask, request, render_template,redirect,jsonify,url_for
from flask_cors import CORS
import requests
import os
import pickle
import mysql.connector
import csv;
from numpy import loadtxt
import pickle
import numpy
from keras.models import load_model
from sklearn.cluster import DBSCAN


app = Flask(__name__)
app.debug = True
CORS(app)

lati = "0"
longi = "0"
amt = "0"

@app.route("/receive_data_verification", methods=['POST'])
def data():
    global lati
    global longi
    global amt
    content = request.json
    # lati = content["d1"]
    # longi = content["d2"]
    # amt = content["d3"]
    content = request.json
    longi=content["longitude"]
    amt=content["amount"]
    lati=content["latitude"] 
    r=requests.post("https://www.amazon.in",json={"code":"0"})
    print(r.status_code)
    return '{"code":"1"}'


@app.route("/receive_data_registration", methods=['POST'])
def receive_data_registration():
    print("registering")
    content = request.json
    cardnumber=content["cardnumber"]
    cvv=content["cvv"]
    month=content["month"]
    year=content["year"] 
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        passwd="",
        database="customer_details")
    mycursor = mydb.cursor()
    mycursor.execute("SELECT * FROM customers WHERE 'cardnumber'='"+cardnumber+"'")
    myresult = mycursor.fetchall()
    if len(myresult)==0:
        print(cardnumber,cvv,month,year)
        mycursor = mydb.cursor()
        query="insert into customers (cardnumber,cvv,month,year) values (%s,%s,%s,%s)"
        value=(cardnumber,cvv,month,year)
        mycursor.execute(query,value)
        mydb.commit()
        row=["latitude","longitude","amount","class"]
        path = 'D:/Ansh Mehta/Desktop/demo_xmlhttp/models/'
        temp = cardnumber.split(" ")
        cardnumber = ''.join(temp)
        myfile = path+cardnumber+".csv"
        row=[0,0,0,0]
        with open(myfile,"w") as f:
            csv.writer(f).writerow(row)
        f.close()
     # verify and add to databse1
    return '{"code":"1"}'

@app.route("/verification")
def verification():
    global lati
    global longi
    global amt
    latitude = lati
    longitude = longi
    amount = amt
    
    return render_template("verification.html",d1=latitude,d2=longitude,d3=amount)

@app.route("/registration")
def register():
    return render_template("registration.html")

@app.route("/predict", methods=['POST'])
def predict():
    if request.method == "POST":
        content = request.json
        cardnumber=content["cardnumber"]
        cvv=content["cvv"]
        latitude=content["latitude"]
        longitude=content["longitude"]
        amount=content["amount"]
        temp = cardnumber.split(" ")
        cardnumber = ''.join(temp)
        #cvv = int(cvv)
        latitude = float(latitude)
        longitude = float(longitude)
        amount = float(''.join(amount[5:].split(',')))
        print(amount)
        path = 'D:/Ansh Mehta/Desktop/demo_xmlhttp/models/'
        row=[amount,latitude,longitude,0]
##        myfile=path+cardnumber+".pkl"
##        with open(myfile, 'rb') as f:
##            model = pickle.load(f)
##        
##        X = np.array([amount,latitude,longitude])
##        X = X.reshape(1,3)
##        score = model.predict(X )

        numpy.random.seed(7)
        dataset = numpy.loadtxt(path+cardnumber+".csv", delimiter=",")
        x = dataset[1:,0:4]
        print(x)
        x = numpy.vstack([x,row])
        amt_avg=0
        lati_avg=0
        longi_avg=0
        x_p=[]
        lt_p=[]
        lg_p=[]
        for i in range(len(x)):
            if x[i][3]==1:
                amt_avg+=x[i][0]
                x_p.append(x[i][0])
                lati_avg+=x[i][1]
                lt_p.append(x[i][1])
                longi_avg+=x[i][2]
                lg_p.append(x[i][2])
        amt_avg/=len(x)
        lati_avg/=len(x)
        longi_avg/=len(x)

        amt_model = DBSCAN(eps=amt_avg+max(x_p))
        amt_model.fit(x[1:,0:1])
        l1=list(amt_model.labels_)

        lati_model = DBSCAN(eps=10)
        lati_model.fit(x[1:,1:2])
        l2=list(lati_model.labels_)

        longi_model = DBSCAN(eps=10)
        longi_model.fit(x[1:,2:3])
        l3=list(longi_model.labels_)

        l=[]
        l.append(l1)
        l.append(l2)
        l.append(l3)
        print(numpy.array(l))
        if l1.count(-1)+l2.count(-1)+l3.count(-1)>=1:
            row=[amount,latitude,longitude,-1]
            with open(path+cardnumber+".csv","a") as f:
                csv.writer(f).writerow(row)
                f.close()
                return '{"code":"Fraudulent"}'
        else:
            row=[amount,latitude,longitude,1]
            with open(path+cardnumber+".csv","a") as f:
                csv.writer(f).writerow(row)
                f.close()
                return '{"code":"Non Fraudulent"}'
        
##        if score==0: 
##            row=[amount,latitude,longitude,0]
##            print(row)
##            myfile = path+cardnumber+".csv"
##            with open(myfile,"a") as f:
##                csv.writer(f).writerow(row)
##            f.close()
##            return '{"code":"Fraudulent"}'
##        else:
##            row=[amount,latitude,longitude,1]
##            print(row)
##            myfile = path+cardnumber+".csv"
##            with open(myfile,"a") as f:
##                csv.writer(f).writerow(row)
##            f.close()
##            return '{"code":"Non Fraudulent"}'

if __name__ == "__main__":
    app.run()
