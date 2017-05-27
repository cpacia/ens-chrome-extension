# ens-chrome-extension
Resolve .eth domains in chrome using an ethereum lite client

<img src="https://raw.githubusercontent.com/cpacia/ens-chrome-extension/master/ens.png" width="10%" height="10%"/>

### Install

Unfortunately we can't install this extension directly from the Chrome store since it also requires the [ens-lite](https://github.com/cpacia/ens-lite)
binary to be installed as well. We can, however, create installers for each OS that will unpack everything and install the extension but they
don't exist as of yet. So for now it's manual install.

- Install Go. Here I'll link to [docs](https://github.com/OpenBazaar/openbazaar-go/tree/master/docs) I wrote for OpenBazaar on how to install on each OS.
- Install go-ethereum
```
go get github.com/ethereum/go-ethereum
cd $GOPATH/src/github.com/ethereum/go-ethereum
make geth
```
- Install the ens-lite resolver
```
go get github.com/cpacia/ens-lite
cd $GOPATH/src/github.com/cpacia/ens-lite/cmd/resolver
go install
```
- Clone this repo
```
git clone https://github.com/cpacia/ens-chrome-extension.git
cd ens-chrome-extension
```
- Install native messaging manifest
```
./install.sh
```
- Install the extension
```
Click on Load unpacked extension in Chrome's settings and select the ens-chrome-extension directory
```
<img src="https://i.imgur.com/Oddhcdo.png"/>

- Enjoy :)


