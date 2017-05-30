# -*- coding: utf-8 -*-
"""
Created on Fri Mar 24 19:28:19 2017

@author: hhv

FastemsAPI, Trelab API -> Python -> Node.js -> Blend4Web
This is the Python code for the FTest17 testing pipeline.
"""
import numpy as np
import matplotlib.pyplot as plt

import json
import urllib.request
from urllib.error import URLError, HTTPError
import requests

import socket
import time
from datetime import datetime

#+++++++++++++++++++A Function for getting stuff from the Fastems Thingworx mobile api
def get_fastems_api_data(apiEndpoint):
    baseurl = 'https://fastems-sandbox.cloud.thingworx.com/Thingworx/Things/MobileApi_v2/services/'
    appKey = 'APIkey here'
    headers = {'appKey': appKey,'Accept': 'application/json'}
    payload = {}
    try: 
        r = requests.post(baseurl+apiEndpoint, headers=headers,data=payload)
        print('Status code: ',r.status_code)
        #print(r.text)
        out = r.json()
    except HTTPError as e:
        print('The server couldn\'t fulfill the request.')
        print('Error code: ', e.code)
    except URLError as e:
        print('We failed to reach a server.')
        print('Reason: ', e.reason)
    return out

def get_tag_data(FlowTagNumber = "1176", StartTime = "2016-11-01T08:00:00", EndTime =  "2017-01-05T10:59:59"):
    # Muodostetaan osoite
    #address = 'https://api.trelab.fi/2/smartTag/'+ tagNumber +  '/graph?type=' + datatype + '&startTime=' + startTime + 'z&endTime=' + endTime + 'z'
    address = 'https://api.trelab.fi/2/smartTag/'+ FlowTagNumber +  '/graph?startTime=' + StartTime + 'z&endTime=' + EndTime + 'z&type=event&subtype=Location'
    print ("ADDRESS:")
    print (address)

    #+++++++++++++++++++PASSWORD MANAGER from https://docs.python.org/3.1/howto/urllib2.html
    # create a password manager
    top_level_url = address #"https://api.trelab.fi"
    username = 'username'
    password = 'password'

    password_mgr = urllib.request.HTTPPasswordMgrWithDefaultRealm()

    password_mgr.add_password(None, top_level_url, username, password)

    handler = urllib.request.HTTPBasicAuthHandler(password_mgr)

    # create "opener" (OpenerDirector instance)
    opener = urllib.request.build_opener(handler)

    # Install the opener.
    # Now all calls to urllib.request.urlopen use our opener.
    urllib.request.install_opener(opener)

    #++++++++++++++++++++++++++++GET DATA+++++++++++++++++++++++++++++++++++++++
    try:
        with opener.open(address) as url:   #urllib.request.urlopen
            req = url.read()

    except HTTPError as e:
        print('The server couldn\'t fulfill the request.')
        print('Error code: ', e.code)
    except URLError as e:
        print('We failed to reach a server.')
        print('Reason: ', e.reason)

    #+++++++++++++++++++++++++++FORM DATA TO LISTS++++++++++++++++++++++++++++++++++++++++
    null = 0 #word null used in data, must be defined as None so that python understands...
    req2 = eval(req.decode("utf-8"))

    #Measured_data = { k: v for d in req2 for k, v in d.items() } #overwrites the same keys...

    t_timestamp = []
    v_value = []

    t_timestamp = [d['timestamp'] for d in req2]
    v_value = [d['value'] for d in req2]

    time_value = [t_timestamp,v_value]  #combining lists
    time_value = np.asarray(time_value) #into numpy array
    time_value = time_value.T           #transposing the array to get time and value into columns
    ind = np.argsort(time_value[:,0])   #sorting based on the timestamps (they are not in correct order in the trelab data!!!)
    time_value = time_value[ind]     

    return time_value
    #Measured_data = Measured_data[Measured_data[:,0].argsort()]


if __name__ == "__main__":  
    
#+++++++++++++GETTING THE FASTEMS SUBSYSTEM STATUS DATA++++++++++++++++++++++++++++++    
    
    #dictionaries containing the known information
    ATA_flow_tag_numbers = {'FT1' : 1155, 'FT2' : 1156, 'FT3' : 1157, 'FT4' : 1158, 'FT5' : 1159, 'FT6' : 1160, 'FT7' : 1161, 'FT8' : 1162, 'FT9': 1163, 'FT10' : 1164}
    ATA_gateway_numbers = {467.0 : 'Okuma lisä', 461.0 : 'Okuma 450',  462.0: 'Fastems lastausasemat', 463.0: 'Vastaanotto', 466.0: 'Lämpökäsittely, ulko-ovi', 464.0: 'Mittapiste (Gleason 446)', 460.0: 'Okuma 455', 459.0: 'Atala', 465.0: 'Ovi 6', 484.0: 'Lähettämö', 483.0: 'Okuma, takakäytävä', 0.0: 'Nowhere to be seen'}
    #coordinates for the Blend4web visualization    
    All_coordinates = {'Okuma lisä' : [12,-7],  'Okuma 450':  [6.5,-6.5], 'Fastems lastausasemat':  [-3,-4], 'Vastaanotto': [-10,-3], 'Lämpökäsittely, ulko-ovi':  [-2, 4.5], 'Mittapiste (Gleason 446)': [2,-6],  'Okuma 455': [10,-6.5], 'Atala': [-15,8], 'Ovi 6': [12,0], 'Lähettämö': [-8,6], 'Okuma, takakäytävä': [7,-9.5], 'Nowhere to be seen' : [15,15]}
        
    
    #define dictionaries for all the required data
    Device_statuses = {'SC' : {'DeviceName': 'Hissi','MaxAlertLevel': 0, 'OrderId' : 0, 'Status' : 0, 'StatusChanged' : 0, 'StatusColor' : 0},
                        'LS 1' : {'DeviceName': 'Latausasema1', 'MaxAlertLevel': 0, 'OrderId' : 0, 'Status' : 0, 'StatusChanged' : 0, 'StatusColor' : 0},
                        'LS 2' : {'DeviceName': 'Latausasema2', 'MaxAlertLevel': 0, 'OrderId' : 0, 'Status' : 0, 'StatusChanged' : 0, 'StatusColor' : 0},
                        'MC 1' : {'DeviceName': 'Machine1', 'MaxAlertLevel': 0, 'OrderId' : 0, 'Status' : 0, 'StatusChanged' : 0, 'StatusColor' : 0},
                        'MC 2' : {'DeviceName': 'Machine2', 'MaxAlertLevel': 0, 'OrderId' : 0, 'Status' : 0, 'StatusChanged' : 0, 'StatusColor' : 0},
                        'CC' : {'DeviceName': 'Cell Controller', 'MaxAlertLevel': 0, 'OrderId' : 0, 'Status' : 0, 'StatusChanged' : 0, 'StatusColor' : 0}}
    
    ATA_flow_tag_locations = {'FT1' : 0, 'FT2' : 0, 'FT3' : 0, 'FT4' : 0, 'FT5' : 0, 'FT6' : 0, 'FT7' : 0, 'FT8' : 0, 'FT9': 0, 'FT10' : 0}
    ATA_flow_tag_coords = {'FT1' : 0, 'FT2' : 0, 'FT3' : 0, 'FT4' : 0, 'FT5' : 0, 'FT6' : 0, 'FT7' : 0, 'FT8' : 0, 'FT9': 0, 'FT10' : 0}
    
    Work_order_history ={'FT1':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT2':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT3':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT4':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT5':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT6':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT7':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT8':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT9':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                     'FT10':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]}
                    }

    Lead_time_plan     ={'FT1':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT2':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT3':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT4':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT5':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT6':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT7':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT8':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT9':{'Time':[], 'Coordinates':[], 'Location':[]},
                         'FT10':{'Time':[], 'Coordinates':[], 'Location':[]}
                    }

   


    apiEndpoint2 = 'GetSystemsStatuses'
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect(("127.0.0.1.",1337)) #open a socket    

    sleep_time = 10 #define the pause between runs (seconds)
    counter = 0
    while True:    
        Work_order_history ={'FT1':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                             'FT2':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT3':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT4':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT5':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT6':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT7':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT8':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT9':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]},
                         'FT10':{'Time':[], 'Coordinates':[], 'Location':[], 'Delay':[]}
                         }           
        
        
        StartTime = "2017-04-20T14:00:00" #Make these update every step
        etime1 = int(time.time()) - 2*3600 #get the UTC-Z end time from the current UNIX-time by - 2 hours in seconds
        etime2  = datetime.fromtimestamp(etime1).strftime('%Y-%m-%d')
        etime3 =  datetime.fromtimestamp(etime1).strftime('%H:%M:%S')   
        etime = etime2+'T'+etime3    
        endTime = etime       
        
        #Get the flow tag data from Trelab         
        for k in ATA_flow_tag_numbers:
            ATA_flow_tag_locations[k] = get_tag_data(FlowTagNumber = str(ATA_flow_tag_numbers[k]), StartTime = "2017-01-01T00:00:01", EndTime = endTime)
        
        
        #Get the current status of the flow tags from the flow tag data
        for j in ATA_flow_tag_locations:
            location = ATA_flow_tag_locations[j][-1][1]
            #n = 1        
            #while location == 0: #if the tag is not currently seen by any gateways, find the last instance it had a location and assume it is there (which is not true!!!)
            #    location = ATA_flow_tag_locations[j][-n][1]
            #    n += 1
            #arrival_time = ATA_flow_tag_locations[j][-n][0] 
            location_name = ATA_gateway_numbers[location]
            pos = (All_coordinates[location_name][0],All_coordinates[location_name][1]) #visualization coordinates
            ATA_flow_tag_coords[j] = pos
        
        #Create the work order history for visualizing the paths. Should not be done at every step!!!
        #Currently only for Flow Tag 1, because the json gets too big if all the historical coordinates of all flow tags are always sent        
        #for l in ATA_flow_tag_locations: 
        for z in range(len(ATA_flow_tag_locations['FT1'])):
            location = ATA_flow_tag_locations['FT1'][z][1]
            location_name = ATA_gateway_numbers[location]
            pos = (All_coordinates[location_name][0],All_coordinates[location_name][1])
            Work_order_history['FT1']['Coordinates'].append(pos)
        
        
        #Get the FMS data from Fastems
        SystemStatuses = get_fastems_api_data(apiEndpoint2)
        Statuses = SystemStatuses['rows'][0]['DeviceListWithStatuses']['rows']

        for k in range (len(Statuses)):
           d_id = Statuses[k]['ShortAlias']
           for subkey in Statuses[k]:        
               Device_statuses[d_id][subkey] = Statuses[k][subkey]
               
        #create the messages to be sent to the server
        
        transfer_dict = {"Device_statuses": Device_statuses, "Flow_tag_positions": ATA_flow_tag_coords, "Work_order_history": Work_order_history}
            
        message = transfer_dict
        msg = json.dumps(message) #convert string to json
        msg = msg.encode('utf8') #convert json to bytes (required by the socket, not needed by other methods!)   
          
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect(("127.0.0.1.",1337)) #open a socket            
        
        sock.send(msg) #send the message on running the model
        print("sent", counter)
        counter += 1
        time.sleep(sleep_time)

            
            
