# JAWSDAYS 2015 Handson Contents (Visualization)

##Getting Start

####Install packages

1. Move to user directory.

2. Install packages as following commands.

```
$ sudo yum install git -y
$ sudo yum install openssl-devel -y
$ sudo yum install gcc-c++ -y
$ sudo yum install make -y
```

3. Install nvm.

```
$ git clone git://github.com/joyent/node.git
$ cd node
$ ./configure
$ sudo make && make install
```

4. Install node.js

```
$ nvm install v0.x.xx
$ nvm use v0.x.xx
$ nvm ls
```

####Run server process

```
$ node server.js
```

##Validate CF Template

```
$ aws cloudformation validate-template --template-body file:///Users/hideyy/dev/jawsdays2015-handson-2/iothandson2.template --region ap-northeast-1
```

## Edison Setup

#### WiFi

```
$ configure_edison --wifi
```

```
Configure Edison: WiFi Connection

Scanning: 1 seconds left

0 :     Rescan for networks
1 :     Manually input a hidden SSID


Enter 0 to rescan for networks.
Enter 1 to input a hidden network SSID:
```
