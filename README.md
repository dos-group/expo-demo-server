# Expo Demo Server

This project creates an Express server on a virtual machine. The server accepts external GET and POST requests and reads and writes data to a Cassandra database. Cassandra tables are created by Express from the schemas provided in the models directory. This demo server only reads and writes data to the WGS_Measurements table in the WaterGridSense keyspace.

## Requirements

[VirutalBox](https://www.virtualbox.org) and [Vagrant](https://www.vagrantup.com) must be installed.

## Installation

Use the provided Vagrantfile to start a virtual machine with ``vagrant up``

This will start Cassandra and an Express server reachable at 192.168.18.101:3000.

## Usage

Once the virtual machine is running, external POST and GET requests can be made to 192.168.18.101:3000.

### POST Requests

POST requests will write data to the WGS_Measurements Cassandra table.
Data can be passed in the body of the request using the following parameters:


| Parameter | Type      |
| --------- | --------- |
| uid       | uuid      |
| type      | text      |
| sensorid  | text      |
| timestamp | timestamp |
| location  | text      |
| rawValue  | double    |
| conValue  | double    |

If a parameter is empty or not passed, placeholder data will be created.

Example request:

```bash
curl -X POST '192.168.18.101:3000/' -d 'uid=6e6b22c1-f909-467c-a67a-117d08254450&type=sensor&sensorid=S-1234&location=Berlin&rawValue=1'
```

On successful requests the server will respond that [uid] has been saved to Cassandra.

### GET Requests

GET requests read a uid passed as a query parameter and return the result. Example request:

```bash
curl -X GET '192.168.18.101:3000/?uid=6e6b22c1-f909-467c-a67a-117d08254450'
```

On successful requests, data corresponding to the uid will be returned from the WGS_Measurements table.
